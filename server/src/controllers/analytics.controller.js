export async function getNutritionalInsights(req, res) {
  const insights = {
    streakDays: 5,
    adherenceRatePct: 88,
    macroDistribution: {
      proteinPct: 30,
      carbsPct: 45,
      fatPct: 25,
    },
    topLoggedFoods: [
      { name: 'Atlantic Salmon', count: 6, category: 'Fish' },
      { name: 'Hass Avocado', count: 5, category: 'Healthy Fats' },
      { name: 'Greek Yogurt (0% Sugar)', count: 5, category: 'Dairy' },
      { name: 'Cooked Quinoa', count: 4, category: 'Grains' },
      { name: 'Chicken Breast', count: 4, category: 'Poultry' },
    ],
    aiCoachingRecommendations: [
      {
        id: 'rec-1',
        category: 'Protein Consistency',
        type: 'positive',
        title: 'Outstanding Protein Anchor',
        detail: 'You reached your 140g protein milestone on 5 of the last 7 days, maintaining lean tissue synthesis.',
      },
      {
        id: 'rec-2',
        category: 'Fiber Opportunity',
        type: 'improvement',
        title: 'Boost Evening Fiber',
        detail: 'Your daily fiber averaged 24g. Adding a handful of chia seeds or raspberries will easily bridge the gap to 30g.',
      },
      {
        id: 'rec-3',
        category: 'Hydration Target',
        type: 'info',
        title: 'Optimal Hydration Rhythm',
        detail: 'You consume 65% of your daily water before 2:00 PM, which supports afternoon metabolic energy.',
      },
    ],
  };

  res.json({
    success: true,
    insights,
  });
}

export async function getDailyAnalytics(req, res) {
  res.json({
    success: true,
    calories: 1420,
    protein: 98,
    carbs: 145,
    fat: 42,
    waterMl: 2200,
  });
}

export async function getWeeklyAnalytics(req, res) {
  res.json({
    success: true,
    days: [
      { day: 'Mon', calories: 2050, protein: 142, carbs: 210, fat: 62 },
      { day: 'Tue', calories: 2120, protein: 138, carbs: 215, fat: 66 },
      { day: 'Wed', calories: 1980, protein: 132, carbs: 195, fat: 58 },
      { day: 'Thu', calories: 2240, protein: 148, carbs: 225, fat: 70 },
      { day: 'Fri', calories: 1850, protein: 125, carbs: 180, fat: 55 },
      { day: 'Sat', calories: 2310, protein: 152, carbs: 240, fat: 74 },
      { day: 'Sun', calories: 1420, protein: 98, carbs: 145, fat: 42 },
    ],
  });
}
