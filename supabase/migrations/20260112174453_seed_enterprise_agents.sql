/*
  # Seed 4 Enterprise AI Agents for Jordan/GCC Market
  
  ## Overview
  Adds 4 specialized enterprise agents targeting manufacturing and business automation in Jordan, Saudi Arabia, and GCC region:
  1. Smart Production Planning AI - Manufacturing capacity calculation
  2. Factory Website Chatbot - Lead generation and customer support
  3. Tender & Consultant Automation - Automated outreach and follow-ups
  4. AI Phone Call Answering Agent - Voice-based customer service
  
  ## Agent Details
  Each agent includes:
  - Detailed configuration forms (Arabic & English)
  - Complete workflow logic
  - Integration requirements
  - Pricing for regional market
  - Example use cases
*/

-- Get category IDs for proper categorization
DO $$
DECLARE
  business_category_id uuid;
  support_category_id uuid;
  tech_category_id uuid;
BEGIN
  SELECT id INTO business_category_id FROM agent_categories WHERE name = 'Business & Strategy' LIMIT 1;
  SELECT id INTO support_category_id FROM agent_categories WHERE name = 'Support & Documentation' LIMIT 1;
  SELECT id INTO tech_category_id FROM agent_categories WHERE name = 'Development & Tech' LIMIT 1;

  -- AGENT 1: Smart Production Planning AI
  INSERT INTO ai_agents (
    name, slug, category_id, purpose, description,
    user_inputs, tools_needed, workflow_logic, output_format,
    example_prompts, pricing_tier, monthly_price, credits_per_use,
    features, is_active, popularity_score
  ) VALUES (
    'Smart Production Planning AI',
    'smart-production-planning',
    business_category_id,
    'Calculate realistic production capacity based on factory constraints, materials, workforce, and equipment',
    'Advanced AI agent designed for manufacturing businesses to accurately calculate production capacity under varying conditions. Takes into account factory resources (machines, workers, shifts), material constraints, rush mode scenarios, and historical data to provide realistic production forecasts with confidence scores and bottleneck identification.',
    '[
      {"name": "factory_name", "type": "text", "placeholder": "Factory or production line name", "required": true},
      {"name": "product_types", "type": "textarea", "placeholder": "List product types (one per line)", "required": true},
      {"name": "metal_types", "type": "multiselect", "options": ["Steel", "Aluminum", "Copper", "Brass", "Stainless Steel", "Iron", "Other"], "required": false},
      {"name": "machines", "type": "textarea", "placeholder": "List machines with capacity (e.g., CNC Machine - 50 units/hour)", "required": true},
      {"name": "shift_hours", "type": "number", "placeholder": "Hours per shift", "required": true},
      {"name": "shifts_per_day", "type": "number", "placeholder": "Number of shifts per day", "required": true},
      {"name": "workers_fulltime", "type": "number", "placeholder": "Full-time workers", "required": true},
      {"name": "workers_parttime", "type": "number", "placeholder": "Part-time workers", "required": false},
      {"name": "rush_mode_enabled", "type": "checkbox", "label": "Enable rush/overtime mode", "required": false},
      {"name": "historical_data", "type": "textarea", "placeholder": "Historical production averages (optional)", "required": false}
    ]'::jsonb,
    '[
      {"name": "Production Calculator", "purpose": "Calculate max capacity based on constraints"},
      {"name": "Bottleneck Analyzer", "purpose": "Identify production bottlenecks"},
      {"name": "Optimization Engine", "purpose": "Suggest capacity improvements"},
      {"name": "Historical Data Processor", "purpose": "Analyze past performance"},
      {"name": "Confidence Scorer", "purpose": "Provide reliability metrics"}
    ]'::jsonb,
    '1. Input Validation: Parse and validate factory parameters (machines, workers, shifts, materials)
2. Resource Mapping: Map each product type to required resources and time
3. Capacity Calculation: Calculate theoretical max capacity per machine and per shift
4. Workforce Analysis: Factor in worker availability, skills, and efficiency
5. Material Constraints: Check if material types limit production
6. Bottleneck Identification: Identify limiting factors (machines, workers, or materials)
7. Rush Mode Calculation: If enabled, calculate overtime/rush capacity
8. Historical Comparison: Compare with historical averages if provided
9. Confidence Scoring: Assign confidence level (0-100%) based on data completeness
10. Optimization Recommendations: Suggest improvements to increase capacity
11. Output Generation: Create detailed production plan with all metrics',
    '**Production Capacity Report:**

**Summary:**
- Maximum Daily Production: [X units]
- Maximum Weekly Production: [Y units]
- Maximum Monthly Production: [Z units]
- Confidence Score: [0-100%]

**Capacity Breakdown:**
- Per Shift Capacity: [X units]
- Per Machine Capacity: [breakdown by machine]
- Worker Productivity: [units per worker]

**Bottleneck Analysis:**
- Primary Bottleneck: [Machine/Worker/Material]
- Impact: [X% capacity reduction]
- Secondary Constraints: [list]

**Rush Mode (if enabled):**
- Overtime Capacity: [+X%]
- Additional Units: [Y units]
- Resource Requirements: [overtime hours, additional workers]

**Optimization Recommendations:**
1. [Specific recommendation to increase capacity]
2. [Resource allocation improvement]
3. [Process optimization suggestion]

**Detailed Metrics:**
- Machine Utilization: [X%]
- Worker Efficiency: [Y%]
- Material Availability: [status]
- Shift Coverage: [hours/week]',
    '[
      "Calculate maximum production for aluminum window frames: 3 CNC machines (30/hr each), 2 shifts (8hr), 12 workers",
      "Factory produces steel doors, has 5 welding stations, 15 workers in 3 shifts, rush mode available on weekends",
      "Small metal fabrication: 2 lathes, 1 press machine, 6 full-time + 3 part-time workers, single 10-hour shift"
    ]'::jsonb,
    'pro',
    199.99,
    15,
    '[
      "Multi-product capacity planning",
      "Machine and equipment tracking",
      "Workforce optimization (full-time, part-time)",
      "Shift scheduling support",
      "Material constraint handling",
      "Bottleneck identification",
      "Rush/overtime mode calculations",
      "Historical data analysis",
      "Confidence scoring",
      "Optimization recommendations",
      "Detailed breakdown reports",
      "Support for metal fabrication industries"
    ]'::jsonb,
    true,
    88
  ) ON CONFLICT (slug) DO NOTHING;

  -- AGENT 2: Factory Website Chatbot
  INSERT INTO ai_agents (
    name, slug, category_id, purpose, description,
    user_inputs, tools_needed, workflow_logic, output_format,
    example_prompts, pricing_tier, monthly_price, credits_per_use,
    features, is_active, popularity_score
  ) VALUES (
    'Factory Website Chatbot',
    'factory-website-chatbot',
    support_category_id,
    'AI-powered chatbot for factory websites to answer customer questions, capture leads, and provide 24/7 support',
    'Intelligent chatbot designed specifically for manufacturing and factory websites. Automatically answers customer questions about products, certifications, capabilities, and pricing. Captures lead information, integrates with CRM systems, and provides seamless handoff to human sales representatives when needed. Supports both Arabic and English with automatic language detection.',
    '[
      {"name": "company_name", "type": "text", "placeholder": "Your company name", "required": true},
      {"name": "products", "type": "textarea", "placeholder": "List your products/services (one per line)", "required": true},
      {"name": "certifications", "type": "textarea", "placeholder": "Certifications and quality standards", "required": false},
      {"name": "capabilities", "type": "textarea", "placeholder": "Manufacturing capabilities and specialties", "required": true},
      {"name": "working_hours", "type": "text", "placeholder": "Business hours (e.g., Sun-Thu 8AM-5PM)", "required": true},
      {"name": "sales_contact", "type": "text", "placeholder": "Sales contact email or phone", "required": true},
      {"name": "documents", "type": "file", "accept": ".pdf,.doc,.docx", "required": false},
      {"name": "faqs", "type": "textarea", "placeholder": "Common FAQs and answers (optional)", "required": false},
      {"name": "crm_integration", "type": "select", "options": ["None", "HubSpot", "Salesforce", "Zoho", "Custom API"], "required": false}
    ]'::jsonb,
    '[
      {"name": "Natural Language Processing", "purpose": "Understand customer questions in Arabic and English"},
      {"name": "Lead Capture System", "purpose": "Collect and store visitor contact information"},
      {"name": "CRM Integration", "purpose": "Sync leads to CRM automatically"},
      {"name": "Language Detection", "purpose": "Auto-detect Arabic or English"},
      {"name": "Knowledge Base", "purpose": "Store company information and FAQs"},
      {"name": "Handoff Manager", "purpose": "Transfer to human agent when needed"}
    ]'::jsonb,
    '1. Initialize Chatbot: Load company information, products, FAQs, and documents
2. Language Detection: Auto-detect visitor language (Arabic/English)
3. Greeting: Welcome visitor in their language
4. Intent Recognition: Understand what the customer is asking about
5. Knowledge Search: Search knowledge base for relevant answers
6. Response Generation: Generate helpful, professional answer
7. Lead Qualification: Ask for contact info if customer shows interest
8. CRM Integration: Save lead to CRM system if provided
9. Escalation Detection: Identify when human assistance is needed
10. Handoff Process: Notify sales team and provide conversation context
11. Follow-up: Schedule follow-up reminders
12. Analytics Logging: Track conversation metrics and common questions',
    '**Chatbot Configuration Package:**

**Chatbot Script:**
- Welcome message (Arabic & English)
- Product information responses
- Certification details
- Capabilities description
- Working hours and availability
- Pricing inquiry handling
- Lead capture flow

**Knowledge Base:**
- Indexed company information
- Product catalog with descriptions
- FAQ answers
- Document references
- Certification details

**Lead Capture Form:**
- Name field
- Company field
- Phone/Email field
- Interest area selection
- Custom message field

**CRM Integration:**
- API endpoint configuration
- Field mapping
- Auto-sync settings
- Lead scoring rules

**Escalation Rules:**
- Triggers for human handoff
- Out-of-hours handling
- Complex question detection
- Contact information for sales team

**Analytics Dashboard:**
- Total conversations
- Lead conversion rate
- Common questions
- Response accuracy
- Language distribution
- Peak usage times',
    '[
      "Customer asks: Do you manufacture stainless steel tanks? What sizes are available?",
      "Visitor inquires: I need ISO 9001 certified metal fabrication. Can you help?",
      "Question in Arabic: ما هي ساعات العمل؟ هل تقدمون خدمات التصنيع حسب الطلب؟"
    ]'::jsonb,
    'pro',
    149.99,
    5,
    '[
      "Bilingual support (Arabic & English)",
      "Auto language detection",
      "24/7 automated responses",
      "Lead capture and qualification",
      "CRM integration (HubSpot, Salesforce, Zoho)",
      "Document upload and indexing",
      "FAQ management",
      "Human handoff capability",
      "Working hours awareness",
      "Conversation analytics",
      "Customizable responses",
      "Multi-channel deployment (website, WhatsApp)"
    ]'::jsonb,
    true,
    92
  ) ON CONFLICT (slug) DO NOTHING;

  -- AGENT 3: Tender & Consultant Automation Agent
  INSERT INTO ai_agents (
    name, slug, category_id, purpose, description,
    user_inputs, tools_needed, workflow_logic, output_format,
    example_prompts, pricing_tier, monthly_price, credits_per_use,
    features, is_active, popularity_score
  ) VALUES (
    'Tender & Consultant Automation',
    'tender-consultant-automation',
    business_category_id,
    'Automate outreach to consultants and tender opportunities with personalized emails and follow-ups',
    'Professional automation agent designed for businesses pursuing tenders, RFPs, and consultant relationships. Automatically sends personalized emails to consultants and procurement contacts, manages follow-up sequences, detects reply sentiment, schedules meetings, and logs all activities in your CRM. Perfect for companies competing for government and corporate contracts in Jordan, GCC, and international markets.',
    '[
      {"name": "company_name", "type": "text", "placeholder": "Your company name", "required": true},
      {"name": "email_accounts", "type": "textarea", "placeholder": "Email addresses to send from (one per line)", "required": true},
      {"name": "target_industries", "type": "multiselect", "options": ["Government", "Construction", "Oil & Gas", "Manufacturing", "Healthcare", "Education", "Infrastructure"], "required": true},
      {"name": "email_templates_ar", "type": "textarea", "placeholder": "Email template in Arabic", "required": true},
      {"name": "email_templates_en", "type": "textarea", "placeholder": "Email template in English", "required": true},
      {"name": "follow_up_days", "type": "number", "placeholder": "Days before follow-up (e.g., 3, 7)", "required": true},
      {"name": "offer_attachments", "type": "file", "accept": ".pdf", "required": false},
      {"name": "calendar_integration", "type": "select", "options": ["Google Calendar", "Outlook", "None"], "required": false},
      {"name": "crm_integration", "type": "select", "options": ["HubSpot", "Salesforce", "Zoho", "Custom API", "None"], "required": false}
    ]'::jsonb,
    '[
      {"name": "Email Sender", "purpose": "Send personalized emails via SMTP"},
      {"name": "Reply Detector", "purpose": "Monitor inbox for replies"},
      {"name": "Sentiment Analyzer", "purpose": "Classify reply sentiment (interested, not interested, neutral)"},
      {"name": "Calendar Integration", "purpose": "Schedule meetings automatically"},
      {"name": "CRM Logger", "purpose": "Log all outreach activity"},
      {"name": "Template Personalizer", "purpose": "Customize emails with contact details"}
    ]'::jsonb,
    '1. Contact List Import: Load consultant/procurement contact lists
2. Language Detection: Determine contact preferred language (Arabic/English)
3. Template Selection: Choose appropriate email template
4. Personalization: Insert contact name, company, project details
5. Email Sending: Send personalized email with attachments
6. Activity Logging: Log email sent to CRM
7. Reply Monitoring: Check inbox for responses
8. Sentiment Analysis: Classify reply as positive, negative, or neutral
9. Follow-up Scheduling: If no reply, schedule follow-up email
10. Meeting Coordination: If interested, propose meeting times
11. Calendar Integration: Create calendar event when meeting confirmed
12. Status Updates: Update CRM with current status (contacted, interested, meeting scheduled)
13. Escalation: Notify sales team of hot leads',
    '**Automation Configuration:**

**Email Campaign Setup:**
- Sender email addresses configured
- Arabic email template personalized
- English email template personalized
- Attachment management (PDFs, company profiles)
- Subject line variations
- Signature block

**Follow-up Sequence:**
- Day 3: First follow-up email
- Day 7: Second follow-up email  
- Day 14: Final follow-up email
- Auto-stop on reply

**Reply Classification:**
- Interested: "Yes, let us schedule a meeting"
- Not Interested: "Not at this time, thanks"
- Neutral: "Send more information"
- Meeting Request: "Can we meet on..."

**CRM Integration:**
- Contact import/export
- Activity logging (emails sent, replies received)
- Status updates (contacted, nurturing, meeting scheduled)
- Lead scoring

**Calendar Integration:**
- Available time slots
- Meeting duration (30/60 min)
- Meeting location/link (Zoom, Teams, Office)
- Auto-send calendar invites

**Analytics Dashboard:**
- Emails sent: [total]
- Reply rate: [X%]
- Positive replies: [X]
- Meetings scheduled: [Y]
- Conversion rate: [Z%]
- Best performing templates',
    '[
      "Send outreach to 50 construction consultants about our metal fabrication services for infrastructure projects",
      "Follow up with government procurement contacts for upcoming tenders in Jordan and Saudi Arabia",
      "Automate consultant relationship management for oil & gas sector opportunities"
    ]'::jsonb,
    'enterprise',
    299.99,
    20,
    '[
      "Bilingual email templates (Arabic & English)",
      "Automated follow-up sequences",
      "Reply detection and sentiment analysis",
      "Meeting scheduling automation",
      "Calendar integration (Google, Outlook)",
      "CRM logging (HubSpot, Salesforce, Zoho)",
      "Attachment management",
      "Contact list import",
      "Email personalization",
      "Activity tracking and analytics",
      "Lead scoring",
      "Team notifications for hot leads"
    ]'::jsonb,
    true,
    86
  ) ON CONFLICT (slug) DO NOTHING;

  -- AGENT 4: AI Phone Call Answering Agent
  INSERT INTO ai_agents (
    name, slug, category_id, purpose, description,
    user_inputs, tools_needed, workflow_logic, output_format,
    example_prompts, pricing_tier, monthly_price, credits_per_use,
    features, is_active, popularity_score
  ) VALUES (
    'AI Phone Call Answering Agent',
    'ai-phone-answering',
    tech_category_id,
    'AI-powered voice agent that answers phone calls, handles customer inquiries, and routes calls to appropriate staff',
    'Advanced voice AI agent that answers incoming phone calls in Arabic or English, understands customer intent, provides information, captures messages, and intelligently routes calls to the right team member. Perfect for factories and businesses that receive high call volumes and want to provide 24/7 phone support without hiring additional staff. Includes call summaries, CRM logging, and emergency escalation.',
    '[
      {"name": "company_name", "type": "text", "placeholder": "Your company name", "required": true},
      {"name": "business_hours", "type": "text", "placeholder": "Business hours (e.g., Sun-Thu 8AM-5PM)", "required": true},
      {"name": "languages", "type": "multiselect", "options": ["Arabic", "English"], "required": true},
      {"name": "knowledge_base", "type": "textarea", "placeholder": "Company information, products, services, FAQs", "required": true},
      {"name": "departments", "type": "textarea", "placeholder": "List departments and their purposes (Sales, Support, Billing)", "required": true},
      {"name": "escalation_contacts", "type": "textarea", "placeholder": "Phone numbers for urgent escalation (one per line)", "required": true},
      {"name": "emergency_keywords", "type": "text", "placeholder": "Keywords that trigger immediate escalation", "required": false},
      {"name": "voicemail_enabled", "type": "checkbox", "label": "Enable voicemail for after-hours", "required": false},
      {"name": "crm_integration", "type": "select", "options": ["HubSpot", "Salesforce", "Zoho", "None"], "required": false}
    ]'::jsonb,
    '[
      {"name": "Speech-to-Text", "purpose": "Convert customer speech to text"},
      {"name": "Intent Classifier", "purpose": "Understand what customer wants"},
      {"name": "Text-to-Speech", "purpose": "Generate natural voice responses"},
      {"name": "Knowledge Base", "purpose": "Access company information"},
      {"name": "Call Router", "purpose": "Transfer to appropriate staff member"},
      {"name": "CRM Logger", "purpose": "Log call details and summaries"},
      {"name": "Voicemail System", "purpose": "Record messages when closed"}
    ]'::jsonb,
    '1. Call Reception: Answer incoming call within 2-3 rings
2. Language Detection: Detect Arabic or English from first spoken words
3. Greeting: Welcome caller in their language
4. Intent Recognition: Understand caller purpose (inquiry, complaint, quote request, meeting)
5. Knowledge Search: Search knowledge base for answers
6. Response Generation: Provide helpful information in natural voice
7. Department Routing: Determine which department can help
8. Availability Check: Check if business hours or after-hours
9. Transfer Logic: If in hours and staff available, transfer call
10. Message Capture: If closed or unavailable, take message
11. Emergency Detection: Check for emergency keywords
12. Escalation: If emergency, immediately connect to emergency contact
13. Call Summary: Generate summary of conversation
14. CRM Logging: Save call record with summary and outcome',
    '**Voice Agent Configuration:**

**Call Flow:**
1. Auto-answer with greeting (Arabic/English)
2. Listen to customer inquiry
3. Provide information or transfer to department
4. Capture message if unavailable
5. Emergency escalation if needed

**Response Scripts:**
- Greeting: "Welcome to [Company], how may I assist you?"
- Product inquiry: "We specialize in [products], let me provide details..."
- Pricing request: "I can connect you to our sales team..."
- After-hours: "We are currently closed. Business hours are [hours]. Would you like to leave a message?"

**Department Routing:**
- Sales inquiries → Sales team
- Technical support → Support team
- Billing questions → Accounting
- General info → AI handles directly
- Emergency → Immediate escalation

**Knowledge Base:**
- Company overview
- Products and services
- Pricing information (general)
- Business hours and location
- Common FAQs

**Call Summaries:**
Each call generates a summary:
- Caller information (if provided)
- Call duration
- Intent/purpose of call
- Information provided
- Outcome (answered, transferred, message taken)
- Follow-up required (yes/no)

**CRM Integration:**
- Log all calls automatically
- Create tasks for follow-ups
- Update contact records
- Track call metrics

**Emergency Protocol:**
- Keywords: "emergency", "urgent", "breakdown", "accident"
- Immediate transfer to emergency contact
- Notification sent via SMS

**Analytics:**
- Total calls received
- Calls answered by AI vs transferred
- Average call duration
- Common inquiry types
- After-hours call volume
- Customer satisfaction (if feedback enabled)',
    '[
      "Customer calls asking about metal fabrication capabilities and pricing",
      "After-hours call requesting quote for urgent production run",
      "Arabic-speaking client inquiring about ISO certifications and delivery times"
    ]'::jsonb,
    'enterprise',
    399.99,
    25,
    '[
      "Bilingual voice support (Arabic & English)",
      "24/7 call answering",
      "Natural voice responses",
      "Intent recognition",
      "Knowledge base integration",
      "Smart call routing to departments",
      "After-hours voicemail",
      "Emergency escalation",
      "Call summaries and transcripts",
      "CRM logging (HubSpot, Salesforce, Zoho)",
      "Business hours awareness",
      "Call analytics and reporting",
      "Message capture and notifications"
    ]'::jsonb,
    true,
    84
  ) ON CONFLICT (slug) DO NOTHING;

END $$;