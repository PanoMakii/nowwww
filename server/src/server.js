import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const server = app.listen(env.port, () => {
  console.log(`
🚀 ==============================================
   Recip52 Backend API Server running
   Environment : ${env.nodeEnv}
   Port        : ${env.port}
   Base URL    : http://localhost:${env.port}/api
   Healthcheck : http://localhost:${env.port}/api/health
🚀 ==============================================
  `);
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log('🔌 HTTP server closed.');

    try {
      await pool.end();
      console.log('🗄️ Database pool drained.');
      process.exit(0);
    } catch (err) {
      console.error('⚠️ Error during DB pool shutdown:', err.message);
      process.exit(1);
    }
  });

  // Force shutdown after 10s if hung
  setTimeout(() => {
    console.error('⏱️ Forcefully terminating after timeout');
    process.exit(1);
  }, 10000);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 [CRITICAL] Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 [FATAL] Uncaught Exception thrown:', err);
  gracefulShutdown('uncaughtException');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
