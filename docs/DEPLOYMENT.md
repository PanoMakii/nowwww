# Recip52 Production Deployment & Operations Playbook

This document provides a comprehensive operational guide for deploying, scaling, and maintaining the **Recip52** nutrition & healthy eating SaaS platform in production environments.

---

## 1. Architectural Topology

Traffic flows from end-user devices through an edge CDN (Vercel/Cloudflare) or Nginx reverse proxy into the client SPA and Express REST API, backed by PostgreSQL 16 and Redis 7.

```
                    +------------------------+
                    ¦       End Users        ¦
                    ¦ (Web, Tablet, Mobile)  ¦
                    +------------------------+
                                ¦ HTTPS (Port 443)
                                ?
                    +------------------------+
                    ¦ Edge CDN / Cloudflare  ¦
                    ¦   (DDoS, SSL, WAF)     ¦
                    +------------------------+
                                ¦
        +-----------------------------------------------+
        ¦ Static SPA Routes                             ¦ API Routes (/api/*)
        ?                                               ?
+------------------------+                    +------------------------+
¦  Vite React 19 Client  ¦                    ¦ Node.js 20 Express API ¦
¦   (Vercel / Netlify /  ¦ --- API Client --> ¦   (Railway / Render /  ¦
¦      Nginx Alpine)     ¦                    ¦     Docker Cluster)    ¦
+------------------------+                    +------------------------+
                                                          ¦
                                +---------------------------------------------------+
                                ¦                                                   ¦
                                ?                                                   ?
                    +------------------------+                          +------------------------+
                    ¦  PostgreSQL 16 Engine  ¦                          ¦  Redis 7 In-Memory DB  ¦
                    ¦ (Neon / Supabase / RDS)¦                          ¦ (Upstash / ElastiCache)¦
                    +------------------------+                          +------------------------+
```

---

## 2. Strategy A: Modern Managed Cloud Deployment (Recommended)

This strategy splits frontend and backend to leverage zero-maintenance serverless infrastructure with automated continuous delivery on git push.

### Step 1: Managed Database & Cache Provisioning

1. **PostgreSQL Database**:
   - Create a free or standard project at [Neon](https://neon.tech) or [Supabase](https://supabase.com).
   - Choose PostgreSQL 16 in your target region.
   - Obtain the connection URI (format: `postgres://user:pass@ep-hostname.region.aws.neon.tech/recip52_db?sslmode=require`).
2. **Redis In-Memory Cache**:
   - Create a serverless database at [Upstash](https://upstash.com).
   - Copy the TLS connection URL (`rediss://default:token@region.upstash.io:6379`).

### Step 2: Backend API Deployment (Render / Railway)

1. Connect your GitHub repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Create a new **Web Service** pointing to the `server/` root directory:
   - **Environment**: Node
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run db:migrate`
   - **Start Command**: `node src/server.js`
   - **Health Check Path**: `/health` or `/api/health`
3. Configure Environment Variables in the service settings:
   ```env
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://recip52.vercel.app,https://yourdomain.com
   DATABASE_URL=postgres://user:pass@ep-hostname.region.aws.neon.tech/recip52_db?sslmode=require
   PGSSLMODE=require
   REDIS_URL=rediss://default:token@region.upstash.io:6379
   JWT_SECRET=[GENERATE_WITH_OPENSSL_RAND_HEX_64]
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=[GENERATE_SEPARATE_HEX_64]
   JWT_REFRESH_EXPIRES_IN=30d
   OPENAI_API_KEY=sk-proj-...
   ```
4. Trigger manual deploy and verify that `GET https://your-api.onrender.com/api/health` returns `200 OK`.

### Step 3: Frontend SPA Deployment (Vercel / Netlify)

1. Connect your repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Configure project build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure Frontend Environment Variables:
   ```env
   VITE_API_BASE_URL=https://your-api.onrender.com/api
   ```
4. Deploy. The integrated `vercel.json` or `netlify.toml` file will automatically manage client-side route rewrites and security headers.

---

## 3. Strategy B: Single-Node Docker Compose VPS Deployment

For self-hosted deployments on AWS EC2, DigitalOcean Droplet, Hetzner, or Linode:

### Step 1: Server Preparation (Ubuntu 22.04 / 24.04 LTS)

```bash
# Update base operating system
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose plugin
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add deploy user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Clone Code & Configure Production Secrets

```bash
# Clone repository
git clone https://github.com/your-username/recip52.git /opt/recip52
cd /opt/recip52

# Create production environment file
cp .env.production.example .env.production
nano .env.production
```

### Step 3: Launch Production Stack

```bash
# Execute initial migrations
docker compose -f docker-compose.prod.yml run --rm backend npm run db:migrate

# Launch all containers in background
docker compose -f docker-compose.prod.yml up -d --build

# Inspect container status
docker compose -f docker-compose.prod.yml ps
```

### Step 4: Automated SSL Termination via Caddy (or Certbot)

Install Caddy as an automated TLS reverse proxy:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Configure `/etc/caddy/Caddyfile`:
```caddy
yourdomain.com, www.yourdomain.com {
    reverse_proxy localhost:80
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```

---

## 4. Zero-Downtime Database Migration Runbook

1. **Migration Safety Rules**:
   - Migrations are versioned SQL scripts located in `server/src/db/migrations/`.
   - Never drop columns in the same release as code that removes their usage; adopt the expand-and-contract pattern.
   - All migrations are tracked inside the transactional `schema_migrations` table.
2. **Execution Command**:
   ```bash
   npm --prefix server run db:migrate
   ```
3. **Rollback Procedures**:
   - In case of an emergency rollback, create a forward migration script (e.g. `003_revert_feature.sql`) and run `npm run db:migrate`.
   - Alternatively, restore a point-in-time snapshot of the database.

---

## 5. Backup & Disaster Recovery Procedures

### Automated Daily PostgreSQL Snapshot

Add a daily cron job to dump database backups:

```bash
# Open crontab editor
crontab -e

# Run daily at 02:00 AM UTC
0 2 * * * pg_dump -U recip_user -d recip52_db -F c -b -v -f /var/backups/recip52_$(date +\%Y\%m\%d).dump
```

To restore from a dump:
```bash
pg_restore -U recip_user -d recip52_db --clean /var/backups/recip52_YYYYMMDD.dump
```

---

## 6. Security Hardening Checklist

- [x] **Strict Transport Security (HSTS)** & HTTPS enabled across all traffic.
- [x] **Rate Limiting**: Configured in Express to restrict abusive request bursts (200 requests / 15 mins).
- [x] **Request Tracing**: `X-Request-ID` generated for every request and logged for correlation.
- [x] **OWASP Top 10 Protections**:
  - `helmet` security headers configured.
  - SQL injection prevented via parameterized queries.
  - XSS mitigated by React 19 output escaping and strict CSP headers.
  - Passwords salted and hashed with `bcryptjs`.
  - Non-root user `node` in backend Docker container.
- [x] **CORS Lockdown**: Origin validation restricting cross-site API access to trusted domains.

---

## 7. Monitoring & Synthetic Health Checks

1. **Uptime Monitoring**:
   - Register the `/api/health` and `/health` endpoints with [BetterStack](https://betterstack.com) or [UptimeRobot](https://uptimerobot.com) with 60-second polling.
   - Alert thresholds: Response code != 200 or response latency > 1,500ms.
2. **Error Tracking**:
   - Configure Sentry DSN in backend environment (`SENTRY_DSN`).
   - Uncaught exceptions and unhandled promise rejections trigger automated alert webhooks.
