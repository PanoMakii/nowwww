-- Recip52 Database Schema Initialization
-- PostgreSQL 14+ / 16

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    daily_calories INTEGER DEFAULT 2000,
    daily_protein_g NUMERIC(6, 2) DEFAULT 120.00,
    daily_carbs_g NUMERIC(6, 2) DEFAULT 225.00,
    daily_fat_g NUMERIC(6, 2) DEFAULT 65.00,
    daily_water_ml INTEGER DEFAULT 2500,
    dietary_restrictions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    units_system VARCHAR(10) DEFAULT 'metric',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Food Items Database
CREATE TABLE IF NOT EXISTS food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(150),
    calories_per_100g NUMERIC(6, 2) NOT NULL,
    protein_per_100g NUMERIC(6, 2) DEFAULT 0.00,
    carbs_per_100g NUMERIC(6, 2) DEFAULT 0.00,
    fat_per_100g NUMERIC(6, 2) DEFAULT 0.00,
    fiber_per_100g NUMERIC(6, 2) DEFAULT 0.00,
    source VARCHAR(50) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Meals Table (Logged by user)
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner, snack
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Meal Items (Relationship between meals and food items)
CREATE TABLE IF NOT EXISTS meal_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    food_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
    custom_name VARCHAR(255),
    serving_size_g NUMERIC(6, 2) NOT NULL,
    calories NUMERIC(6, 2) NOT NULL,
    protein_g NUMERIC(6, 2) DEFAULT 0.00,
    carbs_g NUMERIC(6, 2) DEFAULT 0.00,
    fat_g NUMERIC(6, 2) DEFAULT 0.00
);

-- 6. Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructions JSONB NOT NULL DEFAULT '[]',
    prep_time_minutes INTEGER DEFAULT 15,
    cook_time_minutes INTEGER DEFAULT 25,
    servings INTEGER DEFAULT 2,
    calories_per_serving NUMERIC(6, 2) NOT NULL,
    protein_per_serving NUMERIC(6, 2) DEFAULT 0.00,
    carbs_per_serving NUMERIC(6, 2) DEFAULT 0.00,
    fat_per_serving NUMERIC(6, 2) DEFAULT 0.00,
    image_url TEXT,
    cuisine VARCHAR(100),
    dietary_tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Recipe Ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    food_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    quantity NUMERIC(6, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL
);

-- 8. User Saved Recipes (Bookmarks)
CREATE TABLE IF NOT EXISTS user_saved_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_recipe_save UNIQUE (user_id, recipe_id)
);

-- 9. Wearable Devices
CREATE TABLE IF NOT EXISTS wearable_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL, -- fitbit, garmin, apple_health, google_fit
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_device UNIQUE (user_id, device_type)
);

-- 10. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    steps INTEGER DEFAULT 0,
    calories_burned NUMERIC(6, 2) DEFAULT 0.00,
    heart_rate_avg INTEGER,
    sleep_minutes INTEGER DEFAULT 0,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_activity_date UNIQUE (user_id, date)
);

-- 11. User Follows Table
CREATE TABLE IF NOT EXISTS user_follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- 12. Recipe Reviews & Ratings
CREATE TABLE IF NOT EXISTS recipe_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Macro & Wellness Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration_days INTEGER DEFAULT 30,
    target_metric VARCHAR(100) NOT NULL, -- e.g. 'protein_g', 'water_ml', 'clean_days'
    target_value NUMERIC(8, 2) NOT NULL,
    badge_name VARCHAR(100),
    icon_name VARCHAR(50),
    banner_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Challenge Participants & Progress
CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak_days INTEGER DEFAULT 0,
    progress_percent INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_challenge UNIQUE (user_id, challenge_id)
);

-- 15. Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'logged_meal', 'streak_milestone', 'joined_challenge', 'published_recipe'
    title TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    cheers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal ON meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_recipes_creator ON recipes(created_by);
CREATE INDEX IF NOT EXISTS idx_recipes_public ON recipes(is_public);
CREATE INDEX IF NOT EXISTS idx_user_saved_recipes ON user_saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe ON recipe_reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);

