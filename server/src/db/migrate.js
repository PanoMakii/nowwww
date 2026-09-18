import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkConnection } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/**
 * Migration runner with version tracking table
 */
export async function runMigrations() {
  console.log('🔄 Checking database connection for migrations...');

  const health = await checkConnection();
  if (!health.ok) {
    console.warn('⚠️  PostgreSQL is not reachable:', health.error);
    console.warn('⚡ Recip52 will run in resilient offline mock dataset mode.');
    return { applied: 0, status: 'offline_fallback' };
  }

  const client = await pool.connect();

  try {
    // 1. Create migration tracking table if not present
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch applied migrations
    const { rows } = await client.query('SELECT filename FROM schema_migrations;');
    const appliedSet = new Set(rows.map((r) => r.filename));

    // 3. Read migration directory
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.log('No migrations directory found.');
      return { applied: 0, status: 'no_migrations_dir' };
    }

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`⏩ [Skipped] Migration already applied: ${file}`);
        continue;
      }

      console.log(`⚡ [Applying] Migration: ${file}...`);
      const sqlContent = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      // Execute inside transaction
      await client.query('BEGIN');
      await client.query(sqlContent);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');

      console.log(`✅ [Applied] ${file} successfully.`);
      appliedCount++;
    }

    console.log(`🎉 Migrations complete. Applied ${appliedCount} new migration(s).`);
    return { applied: appliedCount, status: 'success' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Allow direct CLI execution
if (process.argv[1] === __filename) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
