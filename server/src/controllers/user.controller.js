export async function getProfile(req, res) {
  const user = {
    id: req.user?.id || 'demo-user-001',
    email: req.user?.email || 'alex@recip52.com',
    firstName: 'Alex',
    lastName: 'Morgan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    preferences: {
      dailyCalories: 2150,
      dailyProteinG: 140,
      dailyCarbsG: 210,
      dailyFatG: 65,
      dailyWaterMl: 3000,
      dietaryRestrictions: ['High-Protein', 'Low-Sugar'],
      allergies: ['Peanuts'],
      unitsSystem: 'metric',
    },
  };

  res.json({
    success: true,
    user,
  });
}

export async function updatePreferences(req, res) {
  const preferences = req.body;

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    preferences,
  });
}
