/*
  # AI Agents Catalog System

  1. New Tables
    - agent_categories: Stores agent categories
    - ai_agents: Stores all AI agent definitions with specs
    - user_agent_subscriptions: Tracks user subscriptions and usage

  2. Security
    - Enable RLS on all tables
    - Public read access for agents catalog
    - Authenticated users can manage their subscriptions

  3. Indexes
    - Performance indexes for common queries
*/

-- Create agent categories table
CREATE TABLE IF NOT EXISTS agent_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create AI agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES agent_categories(id),
  purpose text NOT NULL,
  description text NOT NULL,
  user_inputs jsonb DEFAULT '[]'::jsonb,
  tools_needed jsonb DEFAULT '[]'::jsonb,
  workflow_logic text NOT NULL,
  output_format text NOT NULL,
  example_prompts jsonb DEFAULT '[]'::jsonb,
  pricing_tier text DEFAULT 'basic',
  monthly_price numeric(10,2) DEFAULT 0,
  credits_per_use integer DEFAULT 10,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  popularity_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user agent subscriptions table
CREATE TABLE IF NOT EXISTS user_agent_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  subscribed_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  UNIQUE(user_id, agent_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_agents_slug ON ai_agents(slug);
CREATE INDEX IF NOT EXISTS idx_ai_agents_category ON ai_agents(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_active ON ai_agents(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_agent_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_agent ON user_agent_subscriptions(agent_id);

-- Enable RLS
ALTER TABLE agent_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_agent_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_categories (public read)
CREATE POLICY "Anyone can view agent categories"
  ON agent_categories FOR SELECT
  TO public
  USING (true);

-- RLS Policies for ai_agents (public read for active agents)
CREATE POLICY "Anyone can view active agents"
  ON ai_agents FOR SELECT
  TO public
  USING (is_active = true);

-- RLS Policies for user_agent_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_agent_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON user_agent_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON user_agent_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON user_agent_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);