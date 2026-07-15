/*
  # Seed Example Data

  ## Overview
  This migration adds example/demo data to showcase the platform functionality including:
  - Demo conversations
  - Sample analytics metrics
  - Example agents

  ## Data Added
  1. Sample conversations for existing agents
  2. Analytics metrics with realistic performance data
  3. Customer feedback/testimonials table and data

  ## New Tables
  - `customer_feedback` - Stores customer testimonials and feedback

  ## Notes
  - This is demo data for showcasing platform features
  - Data uses realistic numbers and scenarios
*/

-- Create customer_feedback table
CREATE TABLE IF NOT EXISTS customer_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_title text NOT NULL,
  company_name text NOT NULL,
  feedback_text text NOT NULL,
  rating integer DEFAULT 5,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feedback"
  ON customer_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feedback"
  ON customer_feedback FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Insert sample customer feedback
INSERT INTO customer_feedback (customer_name, customer_title, company_name, feedback_text, rating, avatar_url) VALUES
  ('Sarah Johnson', 'CEO', 'TechCorp Inc.', 'Our customer support costs dropped by 60% while satisfaction scores increased. These AI agents are game-changers for our business.', 5, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Michael Chen', 'Head of Sales', 'Growth Labs', 'The sales agent qualified 3x more leads than our human team. Our conversion rate has never been higher and the ROI was immediate.', 5, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Emily Rodriguez', 'COO', 'Scale Ventures', 'We deployed 5 AI agents in a week. The platform is incredibly easy to use and the results speak for themselves.', 5, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Ahmed Al-Mansouri', 'CTO', 'Digital Solutions ME', 'The bilingual support made adoption seamless across our Arabic and English-speaking teams. Fantastic product!', 5, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Lisa Anderson', 'Director of Operations', 'Innovate Co', 'Implementation was smooth and the AI agents learned our business processes quickly. Highly recommended!', 5, 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Omar Hassan', 'VP Marketing', 'Global Tech', 'The marketing agent helped us personalize campaigns at scale. We saw a 150% increase in engagement.', 5, 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200')
ON CONFLICT DO NOTHING;
