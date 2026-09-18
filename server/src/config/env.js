import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Database configuration
  databaseUrl: process.env.DATABASE_URL || 'postgres://recip_user:recip_password@localhost:5432/recip52_db',
  pgHost: process.env.PGHOST || 'localhost',
  pgPort: parseInt(process.env.PGPORT || '5432', 10),
  pgDatabase: process.env.PGDATABASE || 'recip52_db',
  pgUser: process.env.PGUSER || 'recip_user',
  pgPassword: process.env.PGPASSWORD || 'recip_password',

  // Redis configuration
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_recip52_fallback',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_recip52_fallback',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // External APIs
  openAiApiKey: process.env.OPENAI_API_KEY || '',
};
