import { pool, checkConnection } from '../config/db.js';
import { runMigrations } from './migrate.js';
import { runSeed } from './seed.js';

export async function resetDatabase() {
  console.log('⚠️  Resetting database: dropping all tables...');

  const health = await checkConnection();
  if (!health.ok) {
    console.warn('⚠️  PostgreSQL is not reachable:', health.error);
    console.warn('⚡ In-memory state remains ready for demo.');
    return { status: 'offline_fallback' };
  }

  const client = await pool.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    await client.query('GRANT ALL ON SCHEMA public TO public;');
    console.log('🧹 Public schema reset successfully.');
  } finally {
    client.release();
  }

  console.log('🔄 Re-running migrations...');
  await runMigrations();

  console.log('🌱 Re-seeding database...');
  await runSeed();

  console.log('✨ Database reset and seed completed successfully!');
}

const __filename = new URL(import.meta.url).pathname;
if (process.argv[1] && process.argv[1].endsWith('reset.js')) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
