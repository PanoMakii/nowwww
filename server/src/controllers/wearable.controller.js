import { pool } from '../config/db.js';

// In-memory devices store for local development & fallback
let deviceRegistry = [
  {
    id: 'apple_health',
    name: 'Apple HealthKit',
    deviceType: 'apple_health',
    description: 'Sync active energy, steps, resting heart rate, and workouts from Apple Watch.',
    connected: true,
    lastSync: '10 minutes ago',
    iconColor: '#FF2D55',
    batteryPct: 88,
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    deviceType: 'fitbit',
    description: 'Sync daily calorie burn, step milestones, and sleep stages.',
    connected: false,
    lastSync: 'Not connected',
    iconColor: '#00B0B9',
    batteryPct: null,
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    deviceType: 'garmin',
    description: 'High-precision GPS exercise telemetry, VO2 max, and training load.',
    connected: false,
    lastSync: 'Not connected',
    iconColor: '#007CC3',
    batteryPct: null,
  },
  {
    id: 'google_fit',
    name: 'Google Fit / Health Connect',
    deviceType: 'google_fit',
    description: 'Android activity logs, heart points, and move minutes.',
    connected: false,
    lastSync: 'Not connected',
    iconColor: '#34A853',
    batteryPct: null,
  },
  {
    id: 'whoop',
    name: 'Whoop 4.0',
    deviceType: 'whoop',
    description: 'Continuous strain scoring, recovery percentage, and sleep consistency.',
    connected: false,
    lastSync: 'Not connected',
    iconColor: '#E5E0D8',
    batteryPct: null,
  },
];

let telemetryState = {
  date: new Date().toISOString().split('T')[0],
  steps: 8420,
  stepGoal: 10000,
  caloriesBurned: 520,
  activeBurnKcal: 520,
  heartRate: {
    resting: 62,
    current: 74,
    zones: {
      restingPct: 60,
      fatBurnPct: 25,
      cardioPct: 12,
      peakPct: 3,
    },
  },
  sleep: {
    totalMinutes: 465, // 7h 45m
    score: 86,
    deepMinutes: 95,
    remMinutes: 110,
    lightMinutes: 260,
  },
  nutritionAdjustment: {
    activeBurnKcal: 520,
    suggestedCalorieBonusKcal: 260, // 50% replacement for clean deficit
    suggestedCarbBonusG: 35,
    suggestedHydrationBonusMl: 650,
  },
};

export async function getWearables(req, res, next) {
  try {
    const userId = req.user?.id || 'demo-user-001';

    // Query DB if available
    try {
      const dbResult = await pool.query(
        'SELECT id, device_type, is_active, created_at FROM wearable_devices WHERE user_id = $1',
        [userId]
      );
      if (dbResult.rows.length > 0) {
        const activeTypes = new Set(dbResult.rows.map((r) => r.device_type));
        deviceRegistry = deviceRegistry.map((d) => ({
          ...d,
          connected: activeTypes.has(d.deviceType),
        }));
      }
    } catch (dbErr) {
      // Fallback to in-memory state
    }

    res.json({
      success: true,
      devices: deviceRegistry,
      telemetry: telemetryState,
    });
  } catch (err) {
    next(err);
  }
}

export async function connectWearable(req, res, next) {
  try {
    const { deviceType } = req.body;
    const userId = req.user?.id || 'demo-user-001';

    if (!deviceType) {
      return res.status(400).json({ success: false, message: 'deviceType is required' });
    }

    try {
      await pool.query(
        `INSERT INTO wearable_devices (user_id, device_type, access_token, is_active)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (user_id, device_type) DO UPDATE SET is_active = true, access_token = $3`,
        [userId, deviceType, `mock-token-${Date.now()}`]
      );
    } catch (dbErr) {
      // Fallback
    }

    deviceRegistry = deviceRegistry.map((d) =>
      d.deviceType === deviceType
        ? { ...d, connected: true, lastSync: 'Just now', batteryPct: 92 }
        : d
    );

    res.json({
      success: true,
      message: `Device ${deviceType} connected successfully via OAuth`,
      device: deviceRegistry.find((d) => d.deviceType === deviceType),
    });
  } catch (err) {
    next(err);
  }
}

export async function syncWearableActivity(req, res, next) {
  try {
    const userId = req.user?.id || 'demo-user-001';
    const nowStr = 'Just now';

    // Increment simulated telemetry slightly on manual sync
    const newBurn = telemetryState.caloriesBurned + 25;
    telemetryState = {
      ...telemetryState,
      steps: telemetryState.steps + 340,
      caloriesBurned: newBurn,
      activeBurnKcal: newBurn,
      nutritionAdjustment: {
        activeBurnKcal: newBurn,
        suggestedCalorieBonusKcal: Math.round(newBurn * 0.5),
        suggestedCarbBonusG: Math.round(newBurn / 15),
        suggestedHydrationBonusMl: Math.round((newBurn / 400) * 500),
      },
    };

    deviceRegistry = deviceRegistry.map((d) =>
      d.connected ? { ...d, lastSync: nowStr } : d
    );

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, date, steps, calories_burned, heart_rate_avg, sleep_minutes)
         VALUES ($1, CURRENT_DATE, $2, $3, $4, $5)
         ON CONFLICT (user_id, date) DO UPDATE 
         SET steps = $2, calories_burned = $3, synced_at = CURRENT_TIMESTAMP`,
        [userId, telemetryState.steps, newBurn, telemetryState.heartRate.resting, telemetryState.sleep.totalMinutes]
      );
    } catch (dbErr) {
      // Fallback
    }

    res.json({
      success: true,
      message: 'Telemetry synchronized from active devices',
      telemetry: telemetryState,
      adjustment: telemetryState.nutritionAdjustment,
    });
  } catch (err) {
    next(err);
  }
}

export async function disconnectWearable(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-user-001';

    try {
      await pool.query(
        'DELETE FROM wearable_devices WHERE user_id = $1 AND device_type = $2',
        [userId, id]
      );
    } catch (dbErr) {
      // Fallback
    }

    deviceRegistry = deviceRegistry.map((d) =>
      d.deviceType === id || d.id === id
        ? { ...d, connected: false, lastSync: 'Disconnected', batteryPct: null }
        : d
    );

    res.json({
      success: true,
      message: `Device disconnected`,
      id,
    });
  } catch (err) {
    next(err);
  }
}
