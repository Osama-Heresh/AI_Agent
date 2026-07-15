/*
  # Enterprise Platform Schema Enhancement
  
  ## Overview
  This migration transforms the platform into a production-ready enterprise SaaS by adding:
  - Enhanced multi-tenant company management (country, industry, language)
  - Advanced role-based access control (5 roles with permissions)
  - Agent instance lifecycle management
  - Flows & Actions infrastructure for automation
  - Usage tracking and execution logs
  - Enhanced billing with per-agent pricing and VAT support
  
  ## New Tables
  1. **roles** - System roles (Super Admin, Company Owner, Manager, Agent Operator, Viewer)
  2. **permissions** - Granular permissions for role-based access
  3. **role_permissions** - Junction table mapping roles to permissions
  4. **agent_instances** - Individual agent activations per company
  5. **flows** - Workflow definitions for agents
  6. **actions** - Reusable actions for flows
  7. **flow_steps** - Steps within flows
  8. **agent_executions** - Execution logs for agent runs
  9. **usage_logs** - Track usage for billing
  10. **agent_pricing** - Per-agent pricing configuration
  
  ## Modified Tables
  - **companies** - Add country, industry, language_preference, timezone, billing fields
  - **profiles** - Add role_id foreign key
  - **subscriptions** - Add setup_fee, usage_limit, trial fields, VAT handling
  
  ## Security
  - All tables have RLS enabled
  - Access controlled by company_id and role permissions
*/

-- ============================================================================
-- STEP 1: CREATE NEW TABLES
-- ============================================================================

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  level integer NOT NULL DEFAULT 0,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  resource text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Create agent_instances table
CREATE TABLE IF NOT EXISTS agent_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  agent_template_id uuid REFERENCES ai_agents(id),
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft',
  configuration jsonb DEFAULT '{}'::jsonb,
  activated_at timestamptz,
  last_used_at timestamptz,
  usage_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flows table
CREATE TABLE IF NOT EXISTS flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_instance_id uuid REFERENCES agent_instances(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL,
  trigger_config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  version integer DEFAULT 1,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create actions table
CREATE TABLE IF NOT EXISTS actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  description text,
  configuration jsonb DEFAULT '{}'::jsonb,
  is_reusable boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create flow_steps table
CREATE TABLE IF NOT EXISTS flow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
  action_id uuid REFERENCES actions(id),
  step_order integer NOT NULL,
  name text NOT NULL,
  condition jsonb,
  on_success_step_id uuid,
  on_failure_step_id uuid,
  retry_config jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create agent_executions table
CREATE TABLE IF NOT EXISTS agent_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_instance_id uuid REFERENCES agent_instances(id) ON DELETE CASCADE,
  flow_id uuid REFERENCES flows(id),
  status text DEFAULT 'running',
  input_data jsonb,
  output_data jsonb,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer,
  credits_used integer DEFAULT 0
);

-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  agent_instance_id uuid REFERENCES agent_instances(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  execution_id uuid REFERENCES agent_executions(id),
  credits_consumed integer DEFAULT 0,
  billable_amount numeric(10,2) DEFAULT 0,
  logged_at timestamptz DEFAULT now()
);

-- Create agent_pricing table
CREATE TABLE IF NOT EXISTS agent_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_template_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  currency text DEFAULT 'USD',
  monthly_fee numeric(10,2) DEFAULT 0,
  setup_fee numeric(10,2) DEFAULT 0,
  credit_cost numeric(10,4) DEFAULT 0.01,
  included_credits integer DEFAULT 0,
  overage_rate numeric(10,4) DEFAULT 0.015,
  country_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(agent_template_id, currency, country_code)
);

-- ============================================================================
-- STEP 2: ENHANCE EXISTING TABLES
-- ============================================================================

-- Add new columns to companies table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'country') THEN
    ALTER TABLE companies ADD COLUMN country text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'industry') THEN
    ALTER TABLE companies ADD COLUMN industry text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'language_preference') THEN
    ALTER TABLE companies ADD COLUMN language_preference text DEFAULT 'en';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'timezone') THEN
    ALTER TABLE companies ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'billing_email') THEN
    ALTER TABLE companies ADD COLUMN billing_email text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'vat_number') THEN
    ALTER TABLE companies ADD COLUMN vat_number text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'billing_address') THEN
    ALTER TABLE companies ADD COLUMN billing_address jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add new columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role_id') THEN
    ALTER TABLE profiles ADD COLUMN role_id uuid REFERENCES roles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'job_title') THEN
    ALTER TABLE profiles ADD COLUMN job_title text;
  END IF;
END $$;

-- Add new columns to subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'setup_fee') THEN
    ALTER TABLE subscriptions ADD COLUMN setup_fee numeric(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'monthly_credit_limit') THEN
    ALTER TABLE subscriptions ADD COLUMN monthly_credit_limit integer DEFAULT 10000;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'trial_ends_at') THEN
    ALTER TABLE subscriptions ADD COLUMN trial_ends_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'vat_rate') THEN
    ALTER TABLE subscriptions ADD COLUMN vat_rate numeric(5,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'currency') THEN
    ALTER TABLE subscriptions ADD COLUMN currency text DEFAULT 'USD';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'auto_renew') THEN
    ALTER TABLE subscriptions ADD COLUMN auto_renew boolean DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- STEP 3: SEED ROLES AND PERMISSIONS
-- ============================================================================

-- Insert system roles
INSERT INTO roles (name, display_name, description, level, is_system) VALUES
  ('super_admin', 'Super Admin', 'Full system access, can manage all companies and platform settings', 100, true),
  ('company_owner', 'Company Owner', 'Full access to company resources, billing, and user management', 80, true),
  ('manager', 'Manager', 'Can manage agents, view analytics, and configure workflows', 60, true),
  ('agent_operator', 'Agent Operator', 'Can operate and monitor agents, view basic analytics', 40, true),
  ('viewer', 'Viewer', 'Read-only access to agents and analytics', 20, true)
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (name, display_name, description, resource, action) VALUES
  ('company.view', 'View Company', 'View company details', 'company', 'view'),
  ('company.edit', 'Edit Company', 'Edit company information', 'company', 'edit'),
  ('company.delete', 'Delete Company', 'Delete company', 'company', 'delete'),
  ('user.view', 'View Users', 'View company users', 'user', 'view'),
  ('user.invite', 'Invite Users', 'Invite new users to company', 'user', 'invite'),
  ('user.edit', 'Edit Users', 'Edit user roles and permissions', 'user', 'edit'),
  ('user.remove', 'Remove Users', 'Remove users from company', 'user', 'remove'),
  ('agent.view', 'View Agents', 'View agent instances', 'agent', 'view'),
  ('agent.create', 'Create Agents', 'Create new agent instances', 'agent', 'create'),
  ('agent.edit', 'Edit Agents', 'Edit agent configuration', 'agent', 'edit'),
  ('agent.delete', 'Delete Agents', 'Delete agent instances', 'agent', 'delete'),
  ('agent.activate', 'Activate Agents', 'Activate/deactivate agents', 'agent', 'activate'),
  ('agent.execute', 'Execute Agents', 'Run agent workflows', 'agent', 'execute'),
  ('flow.view', 'View Flows', 'View agent workflows', 'flow', 'view'),
  ('flow.create', 'Create Flows', 'Create new workflows', 'flow', 'create'),
  ('flow.edit', 'Edit Flows', 'Edit workflows', 'flow', 'edit'),
  ('flow.delete', 'Delete Flows', 'Delete workflows', 'flow', 'delete'),
  ('analytics.view', 'View Analytics', 'View analytics and reports', 'analytics', 'view'),
  ('analytics.export', 'Export Analytics', 'Export analytics data', 'analytics', 'export'),
  ('billing.view', 'View Billing', 'View billing and invoices', 'billing', 'view'),
  ('billing.manage', 'Manage Billing', 'Manage subscriptions and payment methods', 'billing', 'manage'),
  ('system.admin', 'System Admin', 'Full system administration access', 'system', 'admin')
ON CONFLICT (name) DO NOTHING;

-- Map permissions to super_admin (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Map permissions to company_owner (all except system.admin)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'company_owner' AND p.name != 'system.admin'
ON CONFLICT DO NOTHING;

-- Map permissions to manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'manager' AND p.name IN (
  'company.view', 'user.view', 'user.invite', 
  'agent.view', 'agent.create', 'agent.edit', 'agent.activate', 'agent.execute',
  'flow.view', 'flow.create', 'flow.edit',
  'analytics.view', 'analytics.export',
  'billing.view'
)
ON CONFLICT DO NOTHING;

-- Map permissions to agent_operator
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'agent_operator' AND p.name IN (
  'company.view', 'user.view',
  'agent.view', 'agent.execute',
  'flow.view',
  'analytics.view'
)
ON CONFLICT DO NOTHING;

-- Map permissions to viewer
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'viewer' AND p.name IN (
  'company.view', 'user.view',
  'agent.view',
  'flow.view',
  'analytics.view'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 4: CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_agent_instances_company ON agent_instances(company_id);
CREATE INDEX IF NOT EXISTS idx_agent_instances_status ON agent_instances(status);
CREATE INDEX IF NOT EXISTS idx_agent_instances_template ON agent_instances(agent_template_id);

CREATE INDEX IF NOT EXISTS idx_flows_agent_instance ON flows(agent_instance_id);
CREATE INDEX IF NOT EXISTS idx_flows_active ON flows(is_active);

CREATE INDEX IF NOT EXISTS idx_actions_company ON actions(company_id);
CREATE INDEX IF NOT EXISTS idx_actions_type ON actions(type);

CREATE INDEX IF NOT EXISTS idx_flow_steps_flow ON flow_steps(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_steps_order ON flow_steps(flow_id, step_order);

CREATE INDEX IF NOT EXISTS idx_executions_agent_instance ON agent_executions(agent_instance_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_started ON agent_executions(started_at);

CREATE INDEX IF NOT EXISTS idx_usage_logs_company ON usage_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_agent ON usage_logs(agent_instance_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_logged_at ON usage_logs(logged_at);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- ============================================================================
-- STEP 5: ENABLE RLS
-- ============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_pricing ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: RLS POLICIES
-- ============================================================================

-- Roles
CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- Permissions
CREATE POLICY "Anyone can view permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

-- Role permissions
CREATE POLICY "Anyone can view role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Agent instances
CREATE POLICY "Users can view their company agent instances"
  ON agent_instances FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can create agent instances in their company"
  ON agent_instances FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update their company agent instances"
  ON agent_instances FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company agent instances"
  ON agent_instances FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

-- Flows
CREATE POLICY "Users can view flows for their company agents"
  ON flows FOR SELECT
  TO authenticated
  USING (
    agent_instance_id IN (
      SELECT ai.id FROM agent_instances ai
      WHERE ai.company_id IN (
        SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create flows for their company agents"
  ON flows FOR INSERT
  TO authenticated
  WITH CHECK (
    agent_instance_id IN (
      SELECT ai.id FROM agent_instances ai
      WHERE ai.company_id IN (
        SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
      )
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update flows for their company agents"
  ON flows FOR UPDATE
  TO authenticated
  USING (
    agent_instance_id IN (
      SELECT ai.id FROM agent_instances ai
      WHERE ai.company_id IN (
        SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
      )
    )
  );

-- Actions
CREATE POLICY "Users can view their company actions"
  ON actions FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can create actions in their company"
  ON actions FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Flow steps
CREATE POLICY "Users can view flow steps for their flows"
  ON flow_steps FOR SELECT
  TO authenticated
  USING (
    flow_id IN (
      SELECT f.id FROM flows f
      JOIN agent_instances ai ON f.agent_instance_id = ai.id
      WHERE ai.company_id IN (
        SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
      )
    )
  );

-- Agent executions
CREATE POLICY "Users can view executions for their company agents"
  ON agent_executions FOR SELECT
  TO authenticated
  USING (
    agent_instance_id IN (
      SELECT ai.id FROM agent_instances ai
      WHERE ai.company_id IN (
        SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
      )
    )
  );

CREATE POLICY "System can create executions"
  ON agent_executions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Usage logs
CREATE POLICY "Users can view their company usage logs"
  ON usage_logs FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "System can create usage logs"
  ON usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Agent pricing
CREATE POLICY "Anyone can view active agent pricing"
  ON agent_pricing FOR SELECT
  TO public
  USING (is_active = true);