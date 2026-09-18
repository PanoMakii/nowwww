import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const isRemoteDb =
  Boolean(env.databaseUrl) &&
  !env.databaseUrl.includes('localhost') &&
  !env.databaseUrl.includes('127.0.0.1');

export const pool = new Pool(
  env.databaseUrl
    ? {
        connectionString: env.databaseUrl,
        ...(isRemoteDb && { ssl: { rejectUnauthorized: false } }),
      }
    : {
        host: env.pgHost,
        port: env.pgPort,
        database: env.pgDatabase,
        user: env.pgUser,
        password: env.pgPassword,
      }
);

pool.on('error', (err) => {
  console.error('[DB Pool Error]: Unexpected error on idle client', err.message);
});

/**
 * Execute a query with automatic connection management
 * @param {string} text - SQL statement
 * @param {Array} [params] - Query parameters
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Test database connectivity
 * @returns {Promise<{ ok: boolean, latencyMs: number, error?: string }>}
 */
export async function checkConnection() {
  const start = Date.now();
  try {
    const result = await pool.query('SELECT 1 AS health_check');
    return {
      ok: result.rows.length > 0 && result.rows[0].health_check === 1,
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: error.message,
    };
  }
}

/**
 * Gracefully close pool connections
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('✓ Database pool closed gracefully.');
  } catch (err) {
    console.warn('Notice closing DB pool:', err.message);
  }
}

