import { checkConnection } from '../config/db.js';
import { env } from '../config/env.js';

export async function getHealth(req, res, next) {
  try {
    const dbStatus = await checkConnection();

    const healthData = {
      status: dbStatus.ok ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.nodeEnv,
      services: {
        server: { status: 'up' },
        database: {
          status: dbStatus.ok ? 'connected' : 'disconnected',
          latencyMs: dbStatus.latencyMs,
          ...(dbStatus.error && { error: dbStatus.error }),
        },
      },
      system: {
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
      },
    };

    // Return 200 even if DB is degraded so load balancers/health monitors can see service status
    const statusCode = dbStatus.ok ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    next(error);
  }
}
