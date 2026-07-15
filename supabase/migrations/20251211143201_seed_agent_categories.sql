/*
  # Seed Agent Categories

  Inserts 6 main categories for organizing AI agents
*/

INSERT INTO agent_categories (name, description, icon, display_order) VALUES
  ('Content & Marketing', 'Create content, marketing campaigns, and social media', 'PenTool', 1),
  ('Business & Strategy', 'Business consulting, planning, and strategy', 'Briefcase', 2),
  ('Data & Analytics', 'Data analysis, insights, and reporting', 'BarChart3', 3),
  ('Support & Documentation', 'Customer support and document generation', 'MessageSquare', 4),
  ('Development & Tech', 'Code generation, automation, and technical tasks', 'Code', 5),
  ('Personal & Education', 'Health, fitness, and learning assistance', 'BookOpen', 6)
ON CONFLICT DO NOTHING;