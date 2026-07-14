export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  industry: string;
  employee_count: number;
  founded_date: string;
  owner_id: string;
  country?: string;
  language_preference?: string;
  timezone?: string;
  billing_email?: string;
  vat_number?: string;
  billing_address?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  company_id?: string;
  full_name: string;
  role?: string;
  is_admin?: boolean;
  role_id?: string;
  phone?: string;
  job_title?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  level: number;
  is_system: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface AgentTemplate {
  id: string;
  company_id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt_template: string;
  capabilities: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  company_id: string;
  name: string;
  description: string;
  template_id: string;
  status: 'active' | 'inactive' | 'archived';
  configuration: Record<string, any>;
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBase {
  id: string;
  agent_id: string;
  name: string;
  description: string;
  documents_count: number;
  type: 'document' | 'website' | 'database';
  status: 'processing' | 'ready' | 'error';
  error_message: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  user_id: string;
  title: string;
  messages: Message[];
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface AnalyticsMetric {
  id: string;
  agent_id: string;
  date: string;
  total_conversations: number;
  total_messages: number;
  average_response_time: number;
  user_satisfaction: number;
  error_rate: number;
}

export interface Subscription {
  id: string;
  company_id: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  setup_fee?: number;
  monthly_credit_limit?: number;
  trial_ends_at?: string;
  vat_rate?: number;
  currency?: string;
  auto_renew?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  issued_at: string;
  due_at: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface CustomerFeedback {
  id: string;
  customer_name: string;
  customer_name_ar?: string;
  customer_title: string;
  company_name: string;
  company_name_ar?: string;
  feedback_text: string;
  feedback_text_ar?: string;
  rating: number;
  avatar_url?: string;
  created_at: string;
}

export interface AgentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface AIAgent {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  purpose: string;
  description: string;
  user_inputs: UserInput[];
  tools_needed: Tool[];
  workflow_logic: string;
  output_format: string;
  example_prompts: string[];
  pricing_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  monthly_price: number;
  credits_per_use: number;
  features: string[];
  is_active: boolean;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface UserInput {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'file' | 'checkbox' | 'date';
  placeholder?: string;
  label?: string;
  options?: string[];
  accept?: string;
  required: boolean;
}

export interface Tool {
  name: string;
  purpose: string;
}

export interface UserAgentSubscription {
  id: string;
  user_id: string;
  agent_id: string;
  subscribed_at: string;
  last_used_at: string;
  usage_count: number;
  is_active: boolean;
}

export interface AgentInstance {
  id: string;
  company_id: string;
  agent_template_id: string;
  name: string;
  description?: string;
  status: 'draft' | 'configured' | 'active' | 'paused' | 'archived';
  configuration: Record<string, any>;
  activated_at?: string;
  last_used_at?: string;
  usage_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Flow {
  id: string;
  agent_instance_id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  is_active: boolean;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: string;
  company_id: string;
  name: string;
  type: string;
  description?: string;
  configuration: Record<string, any>;
  is_reusable: boolean;
  created_by: string;
  created_at: string;
}

export interface FlowStep {
  id: string;
  flow_id: string;
  action_id: string;
  step_order: number;
  name: string;
  condition?: Record<string, any>;
  on_success_step_id?: string;
  on_failure_step_id?: string;
  retry_config?: Record<string, any>;
  created_at: string;
}

export interface AgentExecution {
  id: string;
  agent_instance_id: string;
  flow_id?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  credits_used: number;
}

export interface UsageLog {
  id: string;
  company_id: string;
  agent_instance_id: string;
  user_id: string;
  execution_id?: string;
  credits_consumed: number;
  billable_amount: number;
  logged_at: string;
}

export interface AgentPricing {
  id: string;
  agent_template_id: string;
  currency: string;
  monthly_fee: number;
  setup_fee: number;
  credit_cost: number;
  included_credits: number;
  overage_rate: number;
  country_code?: string;
  is_active: boolean;
  created_at: string;
}
