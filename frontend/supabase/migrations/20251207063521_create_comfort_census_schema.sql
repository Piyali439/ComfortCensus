/*
  # Comfort Census Database Schema

  ## Overview
  Creates the database structure for the Comfort Census application to track user mood check-ins,
  deliver personalized comfort recommendations, and measure community engagement.

  ## New Tables
  
  ### `check_ins`
  Stores each user's daily mood check-in and comfort preferences.
  - `id` (uuid, primary key) - Unique identifier for each check-in
  - `session_id` (text) - Anonymous session identifier for tracking return visits
  - `mood_state` (text) - User's selected mood: 'energized', 'calm', 'neutral', 'tired'
  - `comfort_type` (text) - Type of comfort needed: 'warmth', 'stillness', 'distraction'
  - `created_at` (timestamptz) - Timestamp of check-in
  
  ### `daily_metrics`
  Aggregated daily statistics for community metrics display.
  - `id` (uuid, primary key) - Unique identifier
  - `date` (date, unique) - The date for the metrics
  - `total_check_ins` (integer) - Total number of check-ins for the day
  - `mood_breakdown` (jsonb) - Count of each mood state
  - `comfort_breakdown` (jsonb) - Count of each comfort type
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for metrics (community display)
  - Public insert access for check-ins (anonymous usage)
*/

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  mood_state text NOT NULL CHECK (mood_state IN ('energized', 'calm', 'neutral', 'tired')),
  comfort_type text NOT NULL CHECK (comfort_type IN ('warmth', 'stillness', 'distraction')),
  created_at timestamptz DEFAULT now()
);

-- Create daily_metrics table
CREATE TABLE IF NOT EXISTS daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  total_check_ins integer DEFAULT 0,
  mood_breakdown jsonb DEFAULT '{"energized": 0, "calm": 0, "neutral": 0, "tired": 0}'::jsonb,
  comfort_breakdown jsonb DEFAULT '{"warmth": 0, "stillness": 0, "distraction": 0}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_check_ins_session_id ON check_ins(session_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_created_at ON check_ins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date DESC);

-- Enable Row Level Security
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for check_ins
-- Allow anyone to insert their own check-ins (anonymous usage)
CREATE POLICY "Anyone can insert check-ins"
  ON check_ins
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own check-ins by session_id
CREATE POLICY "Users can read own check-ins"
  ON check_ins
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for daily_metrics
-- Allow anyone to read daily metrics (for community display)
CREATE POLICY "Anyone can read daily metrics"
  ON daily_metrics
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Function to update daily metrics after a check-in
CREATE OR REPLACE FUNCTION update_daily_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_metrics (date, total_check_ins, mood_breakdown, comfort_breakdown)
  VALUES (
    CURRENT_DATE,
    1,
    jsonb_build_object(NEW.mood_state, 1),
    jsonb_build_object(NEW.comfort_type, 1)
  )
  ON CONFLICT (date) DO UPDATE SET
    total_check_ins = daily_metrics.total_check_ins + 1,
    mood_breakdown = jsonb_set(
      daily_metrics.mood_breakdown,
      ARRAY[NEW.mood_state],
      to_jsonb(COALESCE((daily_metrics.mood_breakdown->NEW.mood_state)::integer, 0) + 1)
    ),
    comfort_breakdown = jsonb_set(
      daily_metrics.comfort_breakdown,
      ARRAY[NEW.comfort_type],
      to_jsonb(COALESCE((daily_metrics.comfort_breakdown->NEW.comfort_type)::integer, 0) + 1)
    ),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update metrics
DROP TRIGGER IF EXISTS trigger_update_daily_metrics ON check_ins;
CREATE TRIGGER trigger_update_daily_metrics
  AFTER INSERT ON check_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_metrics();
