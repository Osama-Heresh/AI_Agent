-- Insert 12 comprehensive AI agents into the ai_agents table
-- Using $agentdata$ delimiter to handle dollar signs in content

-- 1. Content Creation Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Content Creation Agent',
  'content-creation',
  '203a3ac9-bf09-4d2f-92c1-5e977df7aa09', -- Content & Marketing
  'Creates high-quality blogs, ads, social media posts, and SEO-optimized content to boost marketing efforts',
  'AI-powered content creator that generates engaging, professional content across multiple formats. Specializes in blog posts, advertising copy, social media content, and SEO-optimized articles. Uses advanced natural language processing to match your brand voice and target audience.',
  '[
    {"name": "content_type", "type": "select", "options": ["Blog Post", "Social Media Post", "Ad Copy", "Email Newsletter", "Product Description"], "required": true},
    {"name": "topic", "type": "text", "placeholder": "Main topic or subject", "required": true},
    {"name": "tone", "type": "select", "options": ["Professional", "Casual", "Friendly", "Authoritative", "Humorous"], "required": true},
    {"name": "word_count", "type": "number", "min": 100, "max": 5000, "default": 1000},
    {"name": "target_audience", "type": "text", "placeholder": "Describe your target audience"},
    {"name": "keywords", "type": "text", "placeholder": "SEO keywords (comma-separated)"},
    {"name": "call_to_action", "type": "text", "placeholder": "Desired call-to-action"}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Primary content generation engine"},
    {"name": "Grammarly API", "purpose": "Grammar and spelling verification"},
    {"name": "Copyscape API", "purpose": "Plagiarism detection"},
    {"name": "SEMrush API", "purpose": "SEO keyword analysis and optimization"},
    {"name": "Hemingway Editor API", "purpose": "Readability scoring"},
    {"name": "Unsplash API", "purpose": "Suggest relevant images"}
  ]'::jsonb,
  $agentdata$1. Input Analysis: Parse user inputs and identify content requirements
2. Research Phase: Gather relevant information and trending topics using SEMrush API
3. Keyword Integration: Analyze and integrate SEO keywords naturally throughout content
4. Content Generation: Use GPT-4 to create initial draft based on tone, audience, and requirements
5. Readability Check: Run content through Hemingway Editor to ensure appropriate reading level
6. Grammar Verification: Use Grammarly API to check and correct grammar, spelling, and punctuation
7. Plagiarism Detection: Verify content originality using Copyscape API
8. SEO Optimization: Optimize meta descriptions, headers, and keyword density
9. CTA Integration: Incorporate compelling call-to-action elements
10. Final Formatting: Format content with proper headings, bullet points, and structure$agentdata$,
  $agentdata$The agent delivers professionally formatted content in the following structure:

**Main Content**: Fully formatted article/post with proper headings (H1, H2, H3), paragraphs, and bullet points

**SEO Metadata**:
- Meta title (60 characters)
- Meta description (155 characters)
- Primary and secondary keywords
- Suggested internal/external links

**Performance Metrics**:
- Readability score (Flesch-Kincaid)
- Keyword density analysis
- Estimated reading time
- SEO score (out of 100)

**Additional Assets**:
- 3-5 suggested image ideas with Unsplash links
- Social media snippets (Twitter, LinkedIn, Facebook versions)
- Email subject line variations (if applicable)

All content is delivered in Markdown format with HTML export option available.$agentdata$,
  '[
    "Write a 1000-word blog post about AI in healthcare, targeting hospital administrators, professional tone",
    "Create 5 Instagram captions for sustainable clothing brand, casual and friendly tone, include relevant hashtags",
    "Generate ad copy for a SaaS project management tool, emphasizing productivity benefits, 150 words",
    "Write a product description for wireless noise-canceling headphones, highlighting features and benefits, 300 words",
    "Create a weekly email newsletter about digital marketing trends, engaging tone, 800 words with sections"
  ]'::jsonb,
  'pro',
  29.99,
  5,
  '[
    "Multi-format content generation (blogs, social media, ads, emails)",
    "SEO optimization with keyword research and integration",
    "Plagiarism checking and originality verification",
    "Tone and style customization for brand consistency",
    "Readability analysis and optimization",
    "Grammar and spelling verification",
    "Meta tag and description generation",
    "Image suggestion integration",
    "Multiple export formats (Markdown, HTML, Plain Text)",
    "Content performance predictions"
  ]'::jsonb,
  true,
  92
);

-- 2. Customer Support Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Customer Support Agent',
  'customer-support',
  '485e5266-a98f-4dad-ab58-d3ab70821dc6', -- Support & Documentation
  'Reads customer messages and drafts professional responses, integrates with ticketing systems',
  'Advanced AI customer support agent that analyzes customer inquiries, determines sentiment, and generates professional, empathetic responses. Integrates seamlessly with popular ticketing systems like Zendesk, Freshdesk, and Intercom. Handles multiple languages and maintains brand voice consistency.',
  '[
    {"name": "customer_message", "type": "textarea", "placeholder": "Paste the customer message here", "required": true},
    {"name": "customer_name", "type": "text", "placeholder": "Customer name"},
    {"name": "ticket_id", "type": "text", "placeholder": "Ticket or case ID"},
    {"name": "priority", "type": "select", "options": ["Low", "Medium", "High", "Urgent"], "default": "Medium"},
    {"name": "response_tone", "type": "select", "options": ["Professional", "Empathetic", "Apologetic", "Friendly", "Solution-focused"], "default": "Professional"},
    {"name": "company_policies", "type": "textarea", "placeholder": "Relevant company policies or guidelines"},
    {"name": "previous_context", "type": "textarea", "placeholder": "Previous conversation context (optional)"}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Response generation and natural language understanding"},
    {"name": "Sentiment Analysis API", "purpose": "Analyze customer emotion and urgency"},
    {"name": "Translation API", "purpose": "Multi-language support"},
    {"name": "Zendesk API", "purpose": "Ticketing system integration"},
    {"name": "Knowledge Base API", "purpose": "Access company documentation and FAQs"},
    {"name": "CRM Integration", "purpose": "Customer history and account information"}
  ]'::jsonb,
  $agentdata$1. Message Intake: Receive and parse customer message with metadata
2. Sentiment Analysis: Determine customer emotion (frustrated, confused, satisfied) and urgency level
3. Intent Classification: Identify the core issue (billing, technical, account, general inquiry)
4. Context Gathering: Pull relevant customer history, previous tickets, and account information from CRM
5. Knowledge Base Search: Search internal documentation for relevant solutions and policies
6. Response Drafting: Generate professional response addressing all concerns with appropriate tone
7. Policy Verification: Ensure response aligns with company policies and procedures
8. Personalization: Customize response with customer name and specific details
9. Solution Validation: Verify proposed solution is actionable and complete
10. Priority Tagging: Assign appropriate priority and suggest escalation if needed
11. Quality Check: Review response for professionalism, clarity, and completeness
12. Multi-language Support: Translate response if customer message is in non-English language$agentdata$,
  $agentdata$The agent provides a comprehensive support package:

**Draft Response**: Professional, empathetic response ready to send to customer

**Analysis Summary**:
- Customer sentiment: [Positive/Neutral/Negative/Frustrated]
- Urgency level: [Low/Medium/High/Critical]
- Issue category: [Billing/Technical/Account/General]
- Estimated resolution time: [X hours/days]

**Recommended Actions**:
- Immediate steps to resolve issue
- Follow-up actions required
- Escalation recommendation (if needed)
- Related documentation links

**Response Variations**:
- Formal version (for professional/B2B contexts)
- Casual version (for consumer/B2C contexts)
- Brief version (for quick acknowledgment)

**Tags & Classification**:
- Suggested ticket tags
- Priority level assignment
- Department routing recommendation

**Customer Context**:
- Account status and history
- Previous related tickets
- Customer lifetime value indicators$agentdata$,
  '[
    "Customer complaining about billing error: I was charged twice for my subscription this month. This is unacceptable!",
    "Technical issue: The app keeps crashing whenever I try to upload files. Can someone help?",
    "Feature request: When will you add dark mode? I really need this feature for my work.",
    "Account access: I forgot my password and the reset email is not arriving. Please help urgently!",
    "General inquiry: What is your refund policy? I am considering canceling my subscription."
  ]'::jsonb,
  'pro',
  49.99,
  3,
  '[
    "Sentiment analysis and emotion detection",
    "Multi-language support (50+ languages)",
    "Knowledge base integration and search",
    "Priority classification and routing",
    "CRM and ticketing system integration",
    "Brand voice consistency",
    "Escalation detection and recommendations",
    "Response templates and customization",
    "Customer history context",
    "Multiple response tone options",
    "Quality assurance scoring",
    "Suggested follow-up actions"
  ]'::jsonb,
  true,
  89
);

-- 3. Data Analyst Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Data Analyst Agent',
  'data-analyst',
  '3ebdf191-e0a3-4102-8558-a873fc9c6e10', -- Data & Analytics
  'Upload CSV/Excel, analyze, produce insights, charts, and summaries',
  'Professional data analysis agent that transforms raw data into actionable insights. Upload CSV or Excel files and receive comprehensive statistical analysis, visualizations, trend identification, and business recommendations. Perfect for sales data, customer analytics, financial reports, and operational metrics.',
  '[
    {"name": "data_file", "type": "file", "accept": ".csv,.xlsx,.xls", "required": true},
    {"name": "analysis_type", "type": "multiselect", "options": ["Descriptive Statistics", "Trend Analysis", "Correlation Analysis", "Predictive Modeling", "Outlier Detection", "Segmentation"], "required": true},
    {"name": "key_metrics", "type": "text", "placeholder": "Which columns/metrics are most important?"},
    {"name": "business_context", "type": "textarea", "placeholder": "Describe your business context and what you want to learn"},
    {"name": "time_period", "type": "text", "placeholder": "Date range or time period covered"},
    {"name": "visualization_preferences", "type": "multiselect", "options": ["Bar Charts", "Line Graphs", "Pie Charts", "Scatter Plots", "Heat Maps", "Box Plots"]},
    {"name": "comparison_groups", "type": "text", "placeholder": "Groups to compare (e.g., regions, products, time periods)"}
  ]'::jsonb,
  '[
    {"name": "Pandas Library", "purpose": "Data processing and manipulation"},
    {"name": "NumPy Library", "purpose": "Numerical computations"},
    {"name": "Matplotlib/Plotly", "purpose": "Data visualization"},
    {"name": "Scikit-learn", "purpose": "Statistical analysis and ML modeling"},
    {"name": "GPT-4 API", "purpose": "Natural language insights generation"},
    {"name": "Excel Parser", "purpose": "Parse Excel files with multiple sheets"},
    {"name": "Statistics Libraries", "purpose": "Advanced statistical tests"}
  ]'::jsonb,
  $agentdata$1. Data Ingestion: Upload and parse CSV/Excel files, detect column types and structure
2. Data Validation: Check for missing values, duplicates, format errors, and data quality issues
3. Data Cleaning: Handle missing values, remove duplicates, standardize formats
4. Exploratory Analysis: Generate summary statistics (mean, median, mode, std dev, min, max)
5. Distribution Analysis: Analyze data distributions and identify patterns
6. Correlation Analysis: Calculate correlations between variables and identify relationships
7. Trend Identification: Detect time-based trends, seasonality, and patterns
8. Outlier Detection: Identify and analyze anomalies and outliers
9. Segmentation: Group data into meaningful segments or clusters
10. Visualization Generation: Create charts, graphs, and visual representations
11. Statistical Testing: Perform relevant statistical tests and hypothesis testing
12. Predictive Modeling: Build simple predictive models if requested
13. Insight Generation: Use GPT-4 to generate natural language insights and recommendations
14. Business Recommendations: Provide actionable recommendations based on findings$agentdata$,
  $agentdata$The agent delivers a comprehensive analysis package:

**Executive Summary**:
- Key findings in plain language
- Top 3-5 actionable insights
- Critical trends and patterns identified

**Statistical Analysis**:
- Descriptive statistics for all numeric columns
- Distribution analysis with normality tests
- Correlation matrix with significant relationships
- Outlier identification and analysis

**Visual Dashboard**:
- 5-10 interactive charts and graphs
- Trend lines and projections
- Comparison visualizations
- Heat maps for correlation analysis

**Detailed Findings**:
- Segment-by-segment breakdown
- Time-based trend analysis
- Performance metrics comparison
- Anomaly detection results

**Predictive Insights** (if applicable):
- Forecast for next period
- Confidence intervals
- Key drivers and factors

**Data Quality Report**:
- Missing data summary
- Data completeness score
- Quality issues identified

**Recommendations**:
- Strategic business recommendations
- Areas requiring attention
- Optimization opportunities
- Next steps for deeper analysis

All outputs include downloadable visualizations (PNG/SVG) and raw analysis data (CSV).$agentdata$,
  '[
    "Analyze our sales data from last quarter and identify which products are performing best across different regions",
    "Upload customer churn data and help me understand the key factors contributing to customer loss",
    "Review our marketing campaign performance data and tell me which channels have the best ROI",
    "Analyze website traffic data and identify patterns in user behavior and conversion rates",
    "Examine our inventory data and predict which products will need restocking in the next month"
  ]'::jsonb,
  'pro',
  59.99,
  10,
  '[
    "CSV and Excel file support (up to 50MB)",
    "Multiple analysis types (descriptive, predictive, correlation)",
    "Interactive visualizations and charts",
    "Automated data cleaning and validation",
    "Trend forecasting and predictions",
    "Outlier and anomaly detection",
    "Segmentation and clustering analysis",
    "Statistical significance testing",
    "Natural language insights generation",
    "Downloadable reports and visualizations",
    "Multi-sheet Excel support",
    "Custom metric calculations"
  ]'::jsonb,
  true,
  91
);

-- 4. Marketing Strategist Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Marketing Strategist Agent',
  'marketing-strategist',
  '203a3ac9-bf09-4d2f-92c1-5e977df7aa09', -- Content & Marketing
  'Creates full marketing plans, funnels, emails, and campaign calendars',
  'Comprehensive marketing strategy agent that develops complete go-to-market plans, customer acquisition funnels, email marketing sequences, and 90-day content calendars. Combines market research, competitor analysis, and proven marketing frameworks to create actionable strategies tailored to your business.',
  '[
    {"name": "business_description", "type": "textarea", "placeholder": "Describe your business, product, or service", "required": true},
    {"name": "target_audience", "type": "textarea", "placeholder": "Describe your ideal customer (demographics, pain points, goals)", "required": true},
    {"name": "marketing_goals", "type": "multiselect", "options": ["Brand Awareness", "Lead Generation", "Sales Conversion", "Customer Retention", "Market Expansion"], "required": true},
    {"name": "budget_range", "type": "select", "options": ["Under $5000", "$5000-$15000", "$15000-$50000", "$50000+", "Not Sure"]},
    {"name": "current_channels", "type": "multiselect", "options": ["Email", "Social Media", "SEO/Content", "Paid Ads", "Events", "Partnerships"]},
    {"name": "competitors", "type": "text", "placeholder": "Main competitors (comma-separated)"},
    {"name": "unique_value_proposition", "type": "textarea", "placeholder": "What makes you different from competitors?"},
    {"name": "timeline", "type": "select", "options": ["30 days", "90 days", "6 months", "1 year"], "default": "90 days"}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Strategy generation and planning"},
    {"name": "Market Research API", "purpose": "Industry insights and trends"},
    {"name": "Competitor Analysis Tools", "purpose": "Competitive intelligence"},
    {"name": "SEMrush API", "purpose": "SEO and keyword strategy"},
    {"name": "Social Media APIs", "purpose": "Social media analytics and trends"},
    {"name": "Email Templates", "purpose": "Marketing email sequences"},
    {"name": "Marketing Frameworks", "purpose": "AIDA, Customer Journey, Funnel models"}
  ]'::jsonb,
  $agentdata$1. Business Analysis: Deep dive into business model, value proposition, and market position
2. Audience Research: Develop detailed customer personas with pain points and motivations
3. Competitive Intelligence: Analyze competitor strategies, positioning, and marketing tactics
4. Market Opportunity Analysis: Identify market gaps and opportunities
5. Channel Strategy: Determine optimal marketing channels based on audience and budget
6. Funnel Design: Create customer acquisition funnel with touchpoints at each stage
7. Content Strategy: Develop content themes and topics aligned with customer journey
8. Campaign Planning: Design specific campaigns with objectives, tactics, and KPIs
9. Email Sequence Creation: Build nurture and conversion email sequences
10. Content Calendar: Generate 90-day calendar with specific posts, topics, and platforms
11. Budget Allocation: Recommend budget distribution across channels
12. KPI Framework: Define success metrics and tracking mechanisms
13. Implementation Timeline: Create phased rollout plan with milestones
14. Risk Assessment: Identify potential challenges and mitigation strategies$agentdata$,
  $agentdata$The agent delivers an enterprise-grade marketing strategy package:

**Executive Strategy Document**:
- Marketing vision and objectives
- Target audience personas (3-5 detailed profiles)
- Positioning statement and messaging framework
- Competitive differentiation strategy

**Customer Acquisition Funnel**:
- Awareness stage tactics and content
- Consideration stage nurturing approach
- Decision stage conversion strategies
- Retention and loyalty programs
- Funnel visualization with conversion benchmarks

**90-Day Content Calendar**:
- Daily social media posts with copy and hashtags
- Weekly blog topics and outlines
- Email send schedule
- Campaign launches and promotions
- Platform-specific content (Instagram, LinkedIn, Twitter, Facebook)

**Email Marketing Sequences**:
- Welcome series (5-7 emails)
- Lead nurture sequence (8-10 emails)
- Sales conversion sequence (4-6 emails)
- Re-engagement campaign (3-5 emails)
- Complete copy for each email with subject lines

**Channel Strategy Matrix**:
- Recommended channels prioritized by ROI potential
- Budget allocation per channel
- Expected metrics and KPIs per channel
- Content types for each channel

**Campaign Plans**:
- 3-5 detailed campaign blueprints
- Launch checklists and timelines
- Creative briefs and messaging
- Success metrics and tracking

**Implementation Roadmap**:
- Week-by-week action plan
- Resource requirements
- Quick wins for first 30 days
- Milestones and checkpoints

All deliverables provided in editable formats (Google Docs, Excel, PDF).$agentdata$,
  '[
    "Create a complete marketing strategy for my new B2B SaaS product targeting small business owners with a budget of $20k over 3 months",
    "Develop a customer acquisition funnel and 90-day content calendar for my e-commerce sustainable fashion brand aimed at millennial women",
    "Build a marketing plan to launch my online coaching program, focusing on lead generation through content marketing and email nurturing",
    "Design a comprehensive strategy to increase brand awareness for my local restaurant and drive foot traffic",
    "Create a marketing strategy for my mobile app targeting fitness enthusiasts, with focus on app store optimization and social media growth"
  ]'::jsonb,
  'enterprise',
  99.99,
  20,
  '[
    "Complete marketing strategy document",
    "Customer persona development (3-5 personas)",
    "Full customer acquisition funnel design",
    "90-day content calendar across all platforms",
    "Email marketing sequences (4 complete sequences)",
    "Campaign blueprints with creative briefs",
    "Budget allocation recommendations",
    "KPI framework and success metrics",
    "Competitive analysis and positioning",
    "Channel strategy and prioritization",
    "Implementation timeline and roadmap",
    "Quick win identification"
  ]'::jsonb,
  true,
  95
);

-- 5. Document Generator Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Document Generator Agent',
  'document-generator',
  '485e5266-a98f-4dad-ab58-d3ab70821dc6', -- Support & Documentation
  'Generates legal documents, policies, agreements, contracts, and reports',
  'Professional document generation agent specializing in legal documents, business policies, contracts, agreements, and compliance documentation. Uses jurisdiction-specific templates and industry best practices to create legally sound, comprehensive documents. Includes privacy policies, terms of service, employment contracts, NDAs, and more.',
  '[
    {"name": "document_type", "type": "select", "options": ["Privacy Policy", "Terms of Service", "NDA", "Employment Contract", "Service Agreement", "Partnership Agreement", "Independent Contractor Agreement", "Cookie Policy", "GDPR Compliance Doc", "Business Report", "SOP Document"], "required": true},
    {"name": "company_name", "type": "text", "placeholder": "Your company/organization name", "required": true},
    {"name": "jurisdiction", "type": "select", "options": ["United States", "European Union", "United Kingdom", "Canada", "Australia", "Other"], "required": true},
    {"name": "specific_details", "type": "textarea", "placeholder": "Specific clauses, terms, or details to include", "required": true},
    {"name": "parties_involved", "type": "textarea", "placeholder": "Names and details of parties involved (if applicable)"},
    {"name": "effective_date", "type": "date"},
    {"name": "special_provisions", "type": "textarea", "placeholder": "Any special provisions or custom clauses"}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Document drafting and legal language generation"},
    {"name": "Legal Templates Database", "purpose": "Access to jurisdiction-specific templates"},
    {"name": "Compliance Checker", "purpose": "Verify GDPR, CCPA, and other regulations"},
    {"name": "Document Formatter", "purpose": "Professional document formatting"},
    {"name": "Legal Term Dictionary", "purpose": "Ensure proper legal terminology"}
  ]'::jsonb,
  $agentdata$1. Document Type Selection: Identify the specific type of document needed
2. Jurisdiction Analysis: Determine applicable laws, regulations, and requirements
3. Template Selection: Choose appropriate legal template for jurisdiction and document type
4. Information Gathering: Collect all necessary company details, parties, and specific terms
5. Compliance Check: Verify requirements for GDPR, CCPA, industry-specific regulations
6. Clause Generation: Draft standard and custom clauses using proper legal language
7. Customization: Incorporate specific provisions, terms, and special requirements
8. Structure Optimization: Organize document with proper sections, numbering, and hierarchy
9. Legal Review: Check for completeness, consistency, and legal soundness
10. Plain Language Summary: Generate executive summary explaining key points
11. Formatting: Apply professional legal document formatting
12. Version Control: Create main document plus redlined comparison version if updating
13. Disclaimer Addition: Add appropriate legal disclaimers and recommendations$agentdata$,
  $agentdata$The agent delivers a complete documentation package:

**Primary Document**:
- Professionally formatted legal document
- Proper section numbering and hierarchy
- Standard legal formatting and language
- Ready to use with fillable fields highlighted
- Available in DOCX, PDF, and Google Docs formats

**Plain Language Summary**:
- Key terms and provisions explained in simple language
- Important deadlines and obligations highlighted
- Rights and responsibilities overview
- Risk areas and considerations

**Compliance Checklist**:
- Applicable laws and regulations covered
- Compliance requirements met
- Areas requiring legal review (if any)
- Jurisdiction-specific considerations

**Implementation Guide**:
- How to execute/implement the document
- Required signatures and witnesses
- Filing or registration requirements
- Next steps after signing

**Editable Template**:
- Clean version with bracketed fields [FILL IN]
- Instructions for customization
- Optional clauses you can add/remove

**Legal Disclaimer**:
- Notice about limitations
- Recommendation for attorney review
- Jurisdiction-specific notes

**Version Tracking** (if update):
- Redlined version showing changes
- Summary of modifications
- Change log

All documents include disclaimer that they should be reviewed by qualified legal counsel before use.$agentdata$,
  '[
    "Generate a privacy policy for my e-commerce website that is GDPR and CCPA compliant, includes cookie usage and third-party analytics",
    "Create an NDA for a potential business partnership where both parties will share proprietary technology and customer data",
    "Draft an independent contractor agreement for hiring freelance developers, including IP ownership and confidentiality clauses",
    "Generate terms of service for my SaaS platform that includes subscription terms, refund policy, and limitation of liability",
    "Create an employment contract for a senior marketing manager position including non-compete and benefits provisions"
  ]'::jsonb,
  'enterprise',
  79.99,
  15,
  '[
    "Multiple document types (12+ categories)",
    "Jurisdiction-specific templates",
    "GDPR and CCPA compliance checking",
    "Custom clause generation",
    "Plain language summaries",
    "Professional legal formatting",
    "Multiple export formats (PDF, DOCX, Google Docs)",
    "Redlined comparison versions",
    "Implementation guides",
    "Compliance checklists",
    "Standard and custom provisions",
    "Legal disclaimer included"
  ]'::jsonb,
  true,
  87
);

-- 6. Video Script Creator Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Video Script Creator Agent',
  'video-script-creator',
  '203a3ac9-bf09-4d2f-92c1-5e977df7aa09', -- Content & Marketing
  'Creates Instagram/TikTok/YouTube scripts with motion cues, shot lists, and captions',
  'Professional video script creator optimized for social media platforms. Generates engaging scripts with hooks, storytelling elements, visual cues, shot lists, and platform-specific formatting. Includes caption text, hashtag research, and timing breakdowns for Instagram Reels, TikTok, YouTube Shorts, and long-form YouTube content.',
  '[
    {"name": "platform", "type": "select", "options": ["Instagram Reel", "TikTok", "YouTube Short", "YouTube (Long-form)", "Facebook Video", "LinkedIn Video"], "required": true},
    {"name": "video_topic", "type": "text", "placeholder": "Main topic or message of the video", "required": true},
    {"name": "video_length", "type": "select", "options": ["15-30 seconds", "30-60 seconds", "1-3 minutes", "3-5 minutes", "5-10 minutes", "10+ minutes"], "required": true},
    {"name": "video_style", "type": "select", "options": ["Educational", "Entertaining", "Inspirational", "Tutorial/How-to", "Behind-the-scenes", "Product Demo", "Storytelling"]},
    {"name": "target_audience", "type": "text", "placeholder": "Who is this video for?"},
    {"name": "call_to_action", "type": "text", "placeholder": "What action should viewers take?"},
    {"name": "brand_voice", "type": "select", "options": ["Professional", "Casual", "Humorous", "Authoritative", "Inspirational"]},
    {"name": "key_points", "type": "textarea", "placeholder": "Key messages or points to cover"}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Script generation and storytelling"},
    {"name": "Hashtag Research API", "purpose": "Trending and relevant hashtag discovery"},
    {"name": "Platform Analytics", "purpose": "Platform-specific optimization insights"},
    {"name": "Trending Audio Database", "purpose": "Suggest popular audio tracks"},
    {"name": "Caption Generator", "purpose": "Auto-generate captions and subtitles"}
  ]'::jsonb,
  $agentdata$1. Platform Analysis: Identify platform-specific requirements and best practices
2. Hook Generation: Create attention-grabbing first 3 seconds to stop scrolling
3. Story Structure: Develop narrative arc appropriate for video length and style
4. Script Writing: Write conversational, engaging script with natural pacing
5. Timing Breakdown: Segment script with timestamps for each section
6. Visual Direction: Add shot suggestions, camera angles, and motion cues
7. B-Roll Planning: Identify moments needing supplementary footage or graphics
8. Transition Planning: Plan cuts, transitions, and visual effects
9. Call-to-Action Integration: Strategically place CTAs throughout video
10. Caption Generation: Create full caption text with formatting and emojis
11. Hashtag Research: Identify 15-30 relevant hashtags optimized for reach
12. Music Suggestion: Recommend trending audio or music genres
13. Accessibility: Generate subtitle/closed caption text
14. Engagement Hooks: Add prompts for likes, comments, shares, and follows$agentdata$,
  $agentdata$The agent delivers a complete video production package:

**Full Script with Timestamps**:
- Opening hook (0-3 seconds)
- Main content segments with exact timing
- Closing and CTA
- Conversational, camera-ready language
- Natural pauses and emphasis markers

**Shot List & Visual Direction**:
- Scene-by-scene breakdown
- Camera angles (close-up, wide, over-shoulder, etc.)
- Motion cues (pan, zoom, static)
- Props or visual elements needed
- B-roll footage suggestions
- Graphic/text overlay cues

**Caption & Description**:
- Attention-grabbing first line
- Complete video description
- Strategic emoji placement
- Platform-optimized formatting
- Link placement recommendations

**Hashtag Strategy**:
- 15-30 researched hashtags
- Mix of trending, niche, and branded tags
- Hashtag performance insights
- Placement recommendations

**Engagement Optimization**:
- Comment prompt questions
- Community engagement tactics
- Best time to post
- Thumbnail suggestions (for YouTube)

**Production Notes**:
- Estimated production time
- Equipment needs
- Location suggestions
- Editing tips and effects

**Subtitle/Caption File**:
- Full subtitle text in SRT format
- Optimized for accessibility
- Timing synchronized

**Music/Audio Recommendations**:
- 3-5 trending audio options
- Genre and mood suggestions
- Licensing information$agentdata$,
  '[
    "Create a 60-second Instagram Reel script about 5 productivity hacks for entrepreneurs, entertaining style with quick cuts",
    "Write a 3-minute YouTube tutorial script showing how to use Notion for project management, with screen recording cues",
    "Generate a TikTok script (30 seconds) about sustainable fashion tips, targeting Gen Z, humorous tone",
    "Create a YouTube Short script (45 seconds) demonstrating a healthy breakfast recipe, fast-paced with overhead shots",
    "Write a 5-minute YouTube video script reviewing a new smartphone, including unboxing and feature demo sections"
  ]'::jsonb,
  'pro',
  39.99,
  8,
  '[
    "Platform-optimized scripts (Instagram, TikTok, YouTube)",
    "Attention-grabbing hook generation",
    "Shot lists with camera angles and movements",
    "Timestamp breakdowns for editing",
    "B-roll and visual effect suggestions",
    "Caption text with strategic formatting",
    "Hashtag research (15-30 tags)",
    "Trending audio recommendations",
    "Subtitle/closed caption generation (SRT format)",
    "Call-to-action integration",
    "Engagement optimization tactics",
    "Thumbnail concepts (for YouTube)",
    "Production time estimates"
  ]'::jsonb,
  true,
  90
);

-- 7. Business Consultant Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Business Consultant Agent',
  'business-consultant',
  '7e2606bb-52fb-4378-bdd2-8d69d5669966', -- Business & Strategy
  'Analyzes business and gives strategy, pricing, and growth plans',
  'Expert business consultant agent that provides strategic analysis, growth recommendations, pricing strategies, and comprehensive business plans. Performs SWOT analysis, competitive intelligence, market positioning, financial projections, and operational optimization. Ideal for startups, small businesses, and entrepreneurs seeking data-driven strategic guidance.',
  '[
    {"name": "business_overview", "type": "textarea", "placeholder": "Describe your business, products/services, and current situation", "required": true},
    {"name": "consultation_focus", "type": "multiselect", "options": ["Growth Strategy", "Pricing Strategy", "Market Positioning", "Competitive Analysis", "Operations Optimization", "Financial Planning", "Product Strategy", "Go-to-Market Strategy"], "required": true},
    {"name": "revenue_range", "type": "select", "options": ["Pre-revenue", "Under $100k", "$100k-$500k", "$500k-$1M", "$1M-$5M", "$5M+"]},
    {"name": "industry", "type": "text", "placeholder": "Your industry or sector", "required": true},
    {"name": "target_market", "type": "textarea", "placeholder": "Describe your target customers"},
    {"name": "current_challenges", "type": "textarea", "placeholder": "What challenges are you facing?"},
    {"name": "growth_goals", "type": "textarea", "placeholder": "What are your growth objectives?"},
    {"name": "competitors", "type": "text", "placeholder": "Main competitors (comma-separated)"},
    {"name": "team_size", "type": "select", "options": ["Solo founder", "2-5", "6-10", "11-25", "26-50", "50+"]}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Strategic analysis and recommendations"},
    {"name": "Market Research APIs", "purpose": "Industry data and trends"},
    {"name": "Financial Modeling Tools", "purpose": "Revenue projections and scenario planning"},
    {"name": "Competitive Intelligence APIs", "purpose": "Competitor analysis"},
    {"name": "Business Framework Library", "purpose": "SWOT, Porter 5 Forces, Business Model Canvas"},
    {"name": "Pricing Analytics", "purpose": "Pricing strategy and optimization"}
  ]'::jsonb,
  $agentdata$1. Business Assessment: Comprehensive analysis of current business situation
2. SWOT Analysis: Identify strengths, weaknesses, opportunities, and threats
3. Competitive Intelligence: Deep dive into competitor strategies and positioning
4. Market Analysis: Evaluate market size, trends, and growth potential
5. Customer Segmentation: Identify and prioritize customer segments
6. Value Proposition Analysis: Assess and refine unique value proposition
7. Business Model Evaluation: Analyze revenue streams and cost structure
8. Pricing Strategy Development: Create data-driven pricing recommendations
9. Growth Strategy Formulation: Develop multi-channel growth plan
10. Financial Modeling: Build 3-year revenue and expense projections
11. Operational Analysis: Identify efficiency improvements and bottlenecks
12. Risk Assessment: Evaluate business risks and mitigation strategies
13. KPI Framework: Define key performance indicators for tracking success
14. Action Plan Creation: Develop prioritized 90-day action plan
15. Resource Planning: Recommend team, tools, and capital requirements$agentdata$,
  $agentdata$The agent delivers an executive-level consulting package:

**Executive Summary Report**:
- Current business assessment
- Key findings and insights
- Top 5 strategic recommendations
- Expected impact and timeline

**SWOT Analysis**:
- Detailed strengths analysis
- Weaknesses and gaps identified
- Market opportunities mapped
- Threat assessment and mitigation

**Competitive Intelligence Report**:
- Competitor positioning matrix
- Competitive advantages and disadvantages
- Market share analysis
- Differentiation opportunities

**Growth Strategy Plan**:
- Customer acquisition strategies
- Revenue optimization tactics
- Market expansion opportunities
- Partnership and channel strategies
- 12-month growth roadmap

**Pricing Strategy**:
- Current pricing analysis
- Market pricing benchmarks
- Recommended pricing model
- Tiering and packaging suggestions
- Price sensitivity analysis
- Revenue impact projections

**Financial Projections**:
- 3-year revenue forecast (conservative, realistic, optimistic)
- Break-even analysis
- Unit economics and margins
- Cash flow projections
- Funding requirements (if applicable)

**Operational Recommendations**:
- Process optimization opportunities
- Technology and tools recommendations
- Team structure and hiring plan
- Efficiency improvements

**90-Day Action Plan**:
- Prioritized initiatives
- Week-by-week implementation timeline
- Resource requirements
- Quick wins and long-term plays
- Success metrics and milestones

**Business Model Canvas**:
- Complete 9-block canvas
- Value proposition refinement
- Revenue stream optimization

All deliverables in presentation-ready format (PDF, PowerPoint, Google Slides).$agentdata$,
  '[
    "Analyze my SaaS startup generating $50k MRR and provide a growth strategy to reach $200k MRR in 12 months",
    "Help me develop a pricing strategy for my B2B consulting services, currently charging hourly but want to move to value-based pricing",
    "I am launching a direct-to-consumer food product. Create a go-to-market strategy and financial projections for the first year",
    "My e-commerce business has plateaued at $500k annual revenue. Analyze what is holding us back and create an expansion plan",
    "Perform a competitive analysis for my mobile app in the fitness space and recommend positioning and differentiation strategies"
  ]'::jsonb,
  'enterprise',
  149.99,
  25,
  '[
    "Comprehensive SWOT analysis",
    "Competitive intelligence and positioning",
    "Growth strategy development",
    "Pricing strategy and optimization",
    "3-year financial projections",
    "Market opportunity analysis",
    "Business model evaluation",
    "Operational optimization",
    "90-day action plan with priorities",
    "Customer segmentation and targeting",
    "KPI framework and metrics",
    "Risk assessment and mitigation",
    "Resource and hiring recommendations",
    "Business model canvas",
    "Presentation-ready deliverables"
  ]'::jsonb,
  true,
  93
);

-- 8. Research Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Research Agent',
  'research-agent',
  '3ebdf191-e0a3-4102-8558-a873fc9c6e10', -- Data & Analytics
  'Searches web and produces research summaries with citations',
  'Professional research agent that conducts comprehensive web research, analyzes academic papers, synthesizes information from multiple sources, and produces detailed research reports with proper citations. Ideal for market research, academic literature reviews, competitive intelligence, industry trends, and technical research.',
  '[
    {"name": "research_topic", "type": "text", "placeholder": "What do you want to research?", "required": true},
    {"name": "research_depth", "type": "select", "options": ["Overview (5-10 sources)", "Moderate (10-20 sources)", "Comprehensive (20-30 sources)", "Deep Dive (30+ sources)"], "default": "Moderate"},
    {"name": "research_type", "type": "select", "options": ["Market Research", "Academic/Scientific", "Competitive Intelligence", "Industry Trends", "Technical/Product Research", "General Information"]},
    {"name": "source_preferences", "type": "multiselect", "options": ["Academic Papers", "News Articles", "Industry Reports", "Government Data", "Company Websites", "Expert Blogs", "Statistics Databases"]},
    {"name": "time_period", "type": "select", "options": ["Last month", "Last 3 months", "Last year", "Last 3 years", "Last 5 years", "All time"]},
    {"name": "specific_questions", "type": "textarea", "placeholder": "Specific questions you want answered"},
    {"name": "citation_style", "type": "select", "options": ["APA", "MLA", "Chicago", "Harvard"], "default": "APA"}
  ]'::jsonb,
  '[
    {"name": "Web Search APIs", "purpose": "Broad internet search"},
    {"name": "Google Scholar API", "purpose": "Academic paper search"},
    {"name": "PubMed API", "purpose": "Medical and scientific research"},
    {"name": "News APIs", "purpose": "Current news and press releases"},
    {"name": "GPT-4 API", "purpose": "Synthesis and analysis"},
    {"name": "Fact-checking APIs", "purpose": "Verify claims and statistics"},
    {"name": "Citation Generator", "purpose": "Format citations properly"}
  ]'::jsonb,
  $agentdata$1. Query Formulation: Break down research topic into specific search queries
2. Source Identification: Search across multiple databases and sources
3. Source Evaluation: Assess credibility, relevance, and recency of sources
4. Content Extraction: Extract key information, data, and insights from sources
5. Fact Verification: Cross-reference claims across multiple sources
6. Data Synthesis: Identify common themes, patterns, and contradictions
7. Statistical Analysis: Analyze quantitative data and trends
8. Expert Opinion Collection: Gather perspectives from thought leaders
9. Gap Analysis: Identify areas lacking information or consensus
10. Information Organization: Structure findings into logical categories
11. Citation Management: Properly cite all sources in requested format
12. Summary Generation: Create executive summary of key findings
13. Insight Generation: Draw meaningful conclusions and implications
14. Recommendation Development: Provide actionable recommendations based on research
15. Quality Review: Verify accuracy and completeness of research$agentdata$,
  $agentdata$The agent delivers a comprehensive research package:

**Executive Summary**:
- Key findings in 1-2 pages
- Most important insights
- Core conclusions and implications
- Top recommendations

**Detailed Research Report**:
- Introduction and research objectives
- Methodology and sources overview
- Findings organized by themes/categories
- Data and statistics with context
- Expert opinions and perspectives
- Trend analysis
- Comparative analysis (if applicable)
- Gaps and limitations in available research

**Key Insights & Analysis**:
- Major themes and patterns identified
- Surprising or contradictory findings
- Emerging trends
- Historical context
- Future projections and implications

**Data Visualizations** (when applicable):
- Charts and graphs of key statistics
- Trend lines and comparisons
- Infographic-style summaries

**Source Documentation**:
- Annotated bibliography with 20-50+ sources
- Citations in requested format (APA, MLA, etc.)
- Source credibility ratings
- Links to all referenced materials

**Specific Question Answers**:
- Direct answers to user's specific questions
- Supporting evidence for each answer
- Confidence level for each answer

**Recommendations**:
- Actionable next steps based on findings
- Further research suggestions
- Strategic implications

**Appendix**:
- Raw data and statistics
- Extended quotations
- Supplementary materials

All content includes proper citations and is fact-checked across multiple sources.$agentdata$,
  '[
    "Research the current state of AI in healthcare, focusing on diagnostic applications, adoption rates, and regulatory challenges",
    "Conduct market research on the electric vehicle battery industry, including key players, technology trends, and market size projections",
    "Analyze the competitive landscape for B2B project management software, including feature comparison and pricing strategies",
    "Research the effectiveness of different content marketing strategies for SaaS companies, with case studies and ROI data",
    "Investigate emerging trends in sustainable fashion, including consumer behavior shifts and innovative materials being developed"
  ]'::jsonb,
  'pro',
  44.99,
  12,
  '[
    "Multi-source research (academic, news, industry reports)",
    "Academic paper access and analysis",
    "Fact verification across sources",
    "Proper citation formatting (APA, MLA, Chicago, Harvard)",
    "Credibility assessment of sources",
    "Statistical data analysis",
    "Trend identification and analysis",
    "Expert opinion synthesis",
    "Customizable research depth",
    "Time-period filtering",
    "Annotated bibliography generation",
    "Data visualization of findings",
    "Executive summaries",
    "Actionable recommendations"
  ]'::jsonb,
  true,
  88
);

-- 9. Code Generator Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Code Generator Agent',
  'code-generator',
  'a7280fcd-2b0b-4683-adb2-f35892395eba', -- Development & Tech
  'Generates code, fixes bugs, and explains code across multiple languages',
  'Advanced code generation agent that writes, debugs, optimizes, and explains code across 20+ programming languages and frameworks. Generates production-ready code with best practices, error handling, documentation, and unit tests. Supports full-stack development, API integration, database queries, and algorithm implementation.',
  '[
    {"name": "task_type", "type": "select", "options": ["Generate New Code", "Fix Bug", "Optimize Code", "Explain Code", "Add Feature", "Refactor Code", "Write Tests"], "required": true},
    {"name": "programming_language", "type": "select", "options": ["JavaScript", "Python", "TypeScript", "Java", "C#", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "Other"], "required": true},
    {"name": "framework", "type": "text", "placeholder": "Framework if applicable (React, Django, .NET, etc.)"},
    {"name": "description", "type": "textarea", "placeholder": "Describe what you need the code to do", "required": true},
    {"name": "existing_code", "type": "textarea", "placeholder": "Paste existing code here (if fixing/optimizing)"},
    {"name": "requirements", "type": "textarea", "placeholder": "Specific requirements, constraints, or edge cases"},
    {"name": "code_style", "type": "select", "options": ["Standard", "Commented/Verbose", "Minimal", "Production-ready with error handling"]},
    {"name": "include_tests", "type": "checkbox", "label": "Generate unit tests", "default": false}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Code generation and analysis"},
    {"name": "Code Execution Sandbox", "purpose": "Test and validate generated code"},
    {"name": "Syntax Validator", "purpose": "Check syntax correctness"},
    {"name": "Code Formatter", "purpose": "Format code according to standards"},
    {"name": "Documentation Generator", "purpose": "Generate code documentation"},
    {"name": "Security Scanner", "purpose": "Identify security vulnerabilities"}
  ]'::jsonb,
  $agentdata$1. Requirement Analysis: Parse user description and identify functional requirements
2. Language/Framework Selection: Confirm programming language and relevant frameworks
3. Architecture Planning: Design code structure and components
4. Code Generation: Write clean, efficient code following best practices
5. Error Handling: Implement comprehensive error handling and validation
6. Edge Case Coverage: Handle boundary conditions and special cases
7. Documentation: Add inline comments and docstrings
8. Code Review: Check for bugs, inefficiencies, and anti-patterns
9. Security Check: Scan for common security vulnerabilities
10. Optimization: Improve performance and resource efficiency
11. Testing: Generate unit tests with multiple test cases
12. Validation: Run code through syntax validator and formatter
13. Explanation: Provide clear explanation of code logic
14. Usage Examples: Include example usage and integration guidance$agentdata$,
  $agentdata$The agent delivers a complete code package:

**Generated Code**:
- Clean, formatted source code
- Follows language-specific best practices
- Includes error handling and validation
- Comprehensive inline comments
- Proper variable naming and structure

**Documentation**:
- Function/class documentation
- Parameter descriptions
- Return value specifications
- Usage examples
- Integration instructions

**Code Explanation**:
- Plain language explanation of logic
- Step-by-step walkthrough
- Design decisions explained
- Time/space complexity (for algorithms)

**Unit Tests** (if requested):
- Comprehensive test suite
- Multiple test cases covering edge cases
- Test setup and teardown code
- Testing framework appropriate for language

**Usage Examples**:
- 2-3 example implementations
- Common use cases demonstrated
- Integration with other code

**Improvement Suggestions**:
- Alternative approaches
- Performance optimization opportunities
- Scalability considerations

**Dependencies & Setup**:
- Required libraries and versions
- Installation instructions
- Configuration requirements

**Security Notes** (if applicable):
- Security considerations
- Potential vulnerabilities addressed
- Best practices implemented

**For Bug Fixes**:
- Explanation of the bug
- Root cause analysis
- Fixed code with changes highlighted
- Prevention recommendations

All code is syntax-validated and ready to use.$agentdata$,
  '[
    "Write a Python function that connects to a PostgreSQL database and performs CRUD operations with proper error handling",
    "Generate a React component for a shopping cart with add/remove items, quantity updates, and total calculation",
    "Fix this JavaScript bug: async function is not properly handling promise rejections [paste code]",
    "Create a REST API endpoint in Node.js/Express for user authentication with JWT tokens",
    "Write unit tests for this Python class using pytest [paste code]"
  ]'::jsonb,
  'pro',
  54.99,
  7,
  '[
    "20+ programming languages supported",
    "Framework-specific code generation",
    "Bug fixing and debugging assistance",
    "Code optimization and refactoring",
    "Error handling implementation",
    "Unit test generation",
    "Comprehensive code documentation",
    "Security vulnerability scanning",
    "Code explanation in plain language",
    "Best practices enforcement",
    "Syntax validation",
    "Usage examples and integration guides",
    "Algorithm implementation with complexity analysis"
  ]'::jsonb,
  true,
  94
);

-- 10. Health & Fitness Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Health & Fitness Agent',
  'health-fitness',
  '36074448-3ec0-4875-aa40-7350d312b8fb', -- Personal & Education
  'Creates personalized diet, workout plans, and weekly routines',
  'Personalized health and fitness agent that creates custom meal plans, workout routines, and wellness programs based on your goals, dietary restrictions, fitness level, and preferences. Includes macro calculations, grocery lists, exercise demonstrations, and progress tracking recommendations.',
  '[
    {"name": "goal", "type": "select", "options": ["Weight Loss", "Muscle Gain", "Maintain Weight", "Athletic Performance", "General Fitness", "Flexibility/Mobility"], "required": true},
    {"name": "current_stats", "type": "object", "fields": [{"name": "age", "type": "number"}, {"name": "weight", "type": "number"}, {"name": "height", "type": "number"}, {"name": "gender", "type": "select", "options": ["Male", "Female", "Other"]}], "required": true},
    {"name": "fitness_level", "type": "select", "options": ["Beginner", "Intermediate", "Advanced"], "required": true},
    {"name": "dietary_restrictions", "type": "multiselect", "options": ["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Halal", "Kosher", "Nut Allergy"]},
    {"name": "food_preferences", "type": "textarea", "placeholder": "Foods you love, dislike, or can not eat"},
    {"name": "workout_location", "type": "select", "options": ["Home (minimal equipment)", "Home (full equipment)", "Gym", "Outdoor", "Flexible"]},
    {"name": "available_time", "type": "text", "placeholder": "How many days/week and minutes per session?"},
    {"name": "health_conditions", "type": "textarea", "placeholder": "Any injuries, conditions, or limitations (optional)"}
  ]'::jsonb,
  '[
    {"name": "Nutrition Database", "purpose": "Calorie and macro information for foods"},
    {"name": "Exercise Database", "purpose": "Exercise instructions and demonstrations"},
    {"name": "GPT-4 API", "purpose": "Personalized plan generation"},
    {"name": "Macro Calculator", "purpose": "Calculate optimal macros for goals"},
    {"name": "TDEE Calculator", "purpose": "Calculate total daily energy expenditure"}
  ]'::jsonb,
  $agentdata$1. Goal Analysis: Understand user's fitness goals and timeline
2. Stats Assessment: Calculate BMI, TDEE, and baseline metabolic rate
3. Macro Calculation: Determine optimal protein, carbs, and fat based on goals
4. Dietary Preference Integration: Account for restrictions and preferences
5. Meal Plan Creation: Design 7-day meal plan with breakfast, lunch, dinner, snacks
6. Recipe Selection: Choose or create recipes matching preferences and macros
7. Grocery List Generation: Compile complete shopping list organized by category
8. Workout Program Design: Create progressive workout plan based on fitness level
9. Exercise Selection: Choose exercises appropriate for location and equipment
10. Weekly Schedule: Structure workout days with rest/recovery periods
11. Progress Tracking Setup: Define metrics to monitor and frequency
12. Supplement Recommendations: Suggest relevant supplements (if appropriate)
13. Hydration Guidelines: Calculate daily water intake needs
14. Safety Review: Flag any concerns based on health conditions$agentdata$,
  $agentdata$The agent delivers a complete health and fitness program:

**7-Day Meal Plan**:
- Breakfast, lunch, dinner, and 2 snacks daily
- Detailed recipes with instructions
- Macro breakdown for each meal (protein/carbs/fat/calories)
- Portion sizes and serving information
- Meal prep tips and time-saving suggestions

**Organized Grocery List**:
- Categorized by aisle (produce, proteins, dairy, etc.)
- Quantities needed for full week
- Budget-friendly substitution options
- Estimated total cost

**Macro & Calorie Targets**:
- Daily calorie target
- Protein, carbs, and fat goals in grams
- Macro split percentage
- Explanation of why these targets support your goals

**Weekly Workout Plan**:
- 3-6 workout sessions depending on availability
- Specific exercises with sets, reps, and rest periods
- Warm-up and cool-down routines
- Progressive overload strategy
- Rest and recovery days scheduled

**Exercise Demonstrations**:
- Detailed instructions for each exercise
- Proper form cues
- Common mistakes to avoid
- Modification options (easier/harder)
- Equipment alternatives

**Progress Tracking Plan**:
- Metrics to measure (weight, measurements, photos, strength)
- Tracking frequency recommendations
- Adjustment guidelines based on progress

**Supplement Recommendations** (optional):
- Suggested supplements relevant to goals
- Dosage and timing recommendations
- Purpose and expected benefits

**Meal Prep Guide**:
- Batch cooking strategies
- Storage recommendations
- Make-ahead options

**Hydration & Recovery**:
- Daily water intake target
- Sleep recommendations
- Recovery strategies

**Safety Notes**:
- Considerations based on health conditions
- When to seek professional medical advice

Includes disclaimer to consult healthcare provider before starting new diet/exercise program.$agentdata$,
  '[
    "Create a weight loss plan for a 35-year-old female, 160 lbs, intermediate fitness level, wants to lose 15 lbs, vegetarian, has 4 days per week for 45-minute home workouts",
    "Design a muscle-building program for a 22-year-old male, 150 lbs, beginner, full gym access, can workout 5 days a week, no dietary restrictions",
    "Generate a meal and workout plan for a 45-year-old looking to maintain weight and improve overall fitness, has knee issues, prefers outdoor activities",
    "Create a keto meal plan for someone trying to lose 20 lbs, 200 lbs current weight, dislikes seafood, has 30 minutes per day for home workouts",
    "Build a athletic performance plan for a runner training for a marathon, needs high-carb meals and cross-training workouts"
  ]'::jsonb,
  'basic',
  24.99,
  8,
  '[
    "Personalized meal plans (7 days)",
    "Custom workout routines for any fitness level",
    "Macro calculations (protein, carbs, fat)",
    "Detailed grocery lists organized by category",
    "Recipe instructions with macro breakdowns",
    "Exercise demonstrations and form cues",
    "Progressive workout programming",
    "Dietary restriction accommodation",
    "Equipment-flexible workouts (home or gym)",
    "Progress tracking recommendations",
    "Meal prep strategies",
    "Supplement guidance",
    "Hydration calculations"
  ]'::jsonb,
  true,
  86
);

-- 11. Education Tutor Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'Education Tutor Agent',
  'education-tutor',
  '36074448-3ec0-4875-aa40-7350d312b8fb', -- Personal & Education
  'Creates learning paths, quizzes, study plans, and worksheets',
  'Comprehensive education agent that creates personalized learning paths, study plans, quizzes, flashcards, and practice worksheets for any subject. Adapts to different learning styles, grade levels, and educational goals. Ideal for students, teachers, and lifelong learners.',
  '[
    {"name": "subject", "type": "text", "placeholder": "Subject or topic to learn", "required": true},
    {"name": "current_level", "type": "select", "options": ["Beginner", "Elementary School", "Middle School", "High School", "College", "Advanced/Professional"], "required": true},
    {"name": "learning_goal", "type": "textarea", "placeholder": "What do you want to achieve or learn?", "required": true},
    {"name": "timeline", "type": "select", "options": ["1 week", "2 weeks", "1 month", "3 months", "6 months", "Flexible"]},
    {"name": "learning_style", "type": "multiselect", "options": ["Visual", "Auditory", "Reading/Writing", "Kinesthetic/Hands-on"]},
    {"name": "time_commitment", "type": "text", "placeholder": "How many hours per week can you dedicate?"},
    {"name": "output_type", "type": "multiselect", "options": ["Study Plan", "Quizzes", "Flashcards", "Practice Worksheets", "Learning Path", "Study Guide"], "required": true},
    {"name": "difficulty_preference", "type": "select", "options": ["Gradual progression", "Challenging", "Mixed difficulty"]}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Content generation and explanation"},
    {"name": "Educational Content APIs", "purpose": "Access to curriculum standards"},
    {"name": "Quiz Generator", "purpose": "Create varied question types"},
    {"name": "Khan Academy API", "purpose": "Supplementary learning resources"},
    {"name": "YouTube API", "purpose": "Find relevant educational videos"}
  ]'::jsonb,
  $agentdata$1. Learning Goal Analysis: Understand what the learner wants to achieve
2. Current Knowledge Assessment: Identify starting proficiency level
3. Curriculum Research: Research best practices and standards for subject/level
4. Learning Path Design: Create structured progression from current to target level
5. Content Breakdown: Divide subject into logical modules and lessons
6. Resource Curation: Find and recommend supplementary resources
7. Study Plan Creation: Build week-by-week study schedule
8. Quiz Generation: Create varied quizzes with multiple question types
9. Flashcard Development: Design focused flashcards for key concepts
10. Worksheet Creation: Build practice problems and exercises
11. Learning Style Adaptation: Customize materials for preferred learning styles
12. Progress Milestones: Define checkpoints to measure learning progress
13. Review Strategy: Incorporate spaced repetition for retention
14. Challenge Calibration: Ensure appropriate difficulty progression$agentdata$,
  $agentdata$The agent delivers a complete learning package:

**Personalized Learning Path**:
- Module-by-module curriculum
- Clear learning objectives for each section
- Estimated time for each module
- Prerequisite knowledge indicated
- Sequential progression from basics to advanced

**Week-by-Week Study Plan**:
- Daily study activities and topics
- Time allocation for each activity
- Mix of learning, practice, and review
- Flexibility for different schedules
- Built-in review and consolidation periods

**Comprehensive Quizzes**:
- Multiple choice questions
- True/false questions
- Short answer prompts
- Problem-solving exercises
- Detailed answer keys with explanations
- 3-5 quizzes covering different modules

**Flashcard Set**:
- 30-50 flashcards for key concepts
- Front: Term/question
- Back: Definition/answer with context
- Organized by topic
- Ready to use with spaced repetition apps

**Practice Worksheets**:
- 5-10 worksheets with varied exercises
- Progressive difficulty
- Answer keys included
- Real-world application problems
- Step-by-step solution guides

**Study Guide**:
- Summary of key concepts
- Important formulas/definitions
- Memory aids and mnemonics
- Common misconceptions addressed
- Exam tips (if applicable)

**Resource Library**:
- Recommended textbooks and readings
- Video tutorials (YouTube links)
- Interactive websites and tools
- Practice platforms
- Community forums for help

**Progress Tracking**:
- Milestones and checkpoints
- Self-assessment criteria
- How to know when you have mastered each section
- Adjustment recommendations

**Learning Style Customizations**:
- Visual learners: diagrams, charts, videos
- Auditory: podcasts, verbal explanations
- Reading/Writing: articles, written summaries
- Kinesthetic: hands-on activities, experiments

All materials are printable and editable for personal use.$agentdata$,
  '[
    "Create a 1-month study plan to learn basic Python programming for a complete beginner, include quizzes and practice exercises",
    "Design a learning path for high school student preparing for AP Calculus exam in 3 months, need study guide and practice problems",
    "Generate flashcards and worksheets to help a middle schooler learn Spanish vocabulary and basic grammar",
    "Build a study plan for learning digital marketing fundamentals, intermediate level, 2 hours per week for 8 weeks",
    "Create quizzes and study materials for college-level organic chemistry, focusing on reaction mechanisms"
  ]'::jsonb,
  'basic',
  34.99,
  6,
  '[
    "Personalized learning paths for any subject",
    "Week-by-week study plans",
    "Multiple quiz formats (MCQ, short answer, problem-solving)",
    "Custom flashcard sets (30-50 cards)",
    "Practice worksheets with answer keys",
    "Comprehensive study guides",
    "Resource recommendations (videos, articles, tools)",
    "Learning style adaptations",
    "Progress tracking milestones",
    "Spaced repetition integration",
    "Difficulty progression",
    "Real-world application examples"
  ]'::jsonb,
  true,
  85
);

-- 12. SaaS Automation Agent
INSERT INTO ai_agents (
  name, slug, category_id, purpose, description, 
  user_inputs, tools_needed, workflow_logic, output_format, 
  example_prompts, pricing_tier, monthly_price, credits_per_use, 
  features, is_active, popularity_score
) VALUES (
  'SaaS Automation Agent',
  'saas-automation',
  'a7280fcd-2b0b-4683-adb2-f35892395eba', -- Development & Tech
  'Creates workflows and automation ideas using Flow logic',
  'Advanced automation agent that designs complex workflows connecting multiple SaaS tools and services. Creates visual flowcharts, defines triggers and actions, handles conditional logic, error handling, and data transformations. Perfect for automating business processes, integrating tools like Zapier, Make.com, or custom APIs.',
  '[
    {"name": "automation_goal", "type": "textarea", "placeholder": "Describe what you want to automate", "required": true},
    {"name": "trigger", "type": "text", "placeholder": "What starts this automation? (e.g., new email, form submission)", "required": true},
    {"name": "tools_used", "type": "multiselect", "options": ["Gmail", "Slack", "Google Sheets", "Airtable", "Notion", "HubSpot", "Salesforce", "Stripe", "Mailchimp", "Calendly", "Trello", "Asana", "Shopify", "WordPress", "Custom API", "Other"], "required": true},
    {"name": "desired_outcome", "type": "textarea", "placeholder": "What should happen at the end of this automation?", "required": true},
    {"name": "data_to_transform", "type": "textarea", "placeholder": "Any data transformations or calculations needed?"},
    {"name": "conditions", "type": "textarea", "placeholder": "Any if/then conditions or branching logic?"},
    {"name": "error_handling", "type": "select", "options": ["Basic", "Advanced with notifications", "Retry logic", "Fallback actions"]},
    {"name": "automation_platform", "type": "select", "options": ["Zapier", "Make.com", "n8n", "Custom Code", "Not sure yet"]}
  ]'::jsonb,
  '[
    {"name": "GPT-4 API", "purpose": "Workflow logic design"},
    {"name": "Zapier API", "purpose": "Integration with 5000+ apps"},
    {"name": "Make.com API", "purpose": "Advanced automation scenarios"},
    {"name": "API Documentation", "purpose": "Research tool capabilities and endpoints"},
    {"name": "Flowchart Generator", "purpose": "Create visual workflow diagrams"}
  ]'::jsonb,
  $agentdata$1. Goal Clarification: Understand the business process to automate
2. Trigger Identification: Define what event starts the workflow
3. Tool Mapping: Identify all SaaS tools and services involved
4. Data Flow Analysis: Map how data moves between tools
5. Logic Design: Create step-by-step workflow with branching logic
6. Condition Definition: Set up if/then rules and filtering conditions
7. Data Transformation: Design data formatting, parsing, and calculations
8. Action Sequencing: Order actions and define dependencies
9. Error Handling: Plan for failures, retries, and fallback actions
10. Testing Strategy: Define test cases and validation points
11. Optimization: Identify opportunities to reduce steps or improve efficiency
12. Documentation: Create clear workflow documentation
13. Visual Flowchart: Generate visual diagram of complete workflow
14. Implementation Guide: Provide step-by-step setup instructions
15. Alternative Approaches: Suggest variations or improvements$agentdata$,
  $agentdata$The agent delivers a complete automation package:

**Visual Workflow Diagram**:
- Flowchart showing all steps, decisions, and connections
- Clear icons for each tool/service
- Color-coded for triggers, actions, conditions, errors
- Exportable as PNG/PDF
- Mermaid diagram code for editing

**Detailed Workflow Logic**:
- Step-by-step breakdown of entire automation
- Trigger definition and configuration
- Each action explained with specifics
- All conditional logic (if/then/else)
- Data transformations and mappings
- Error handling and recovery steps

**Implementation Guide**:
- Platform-specific setup instructions (Zapier/Make.com/etc.)
- Required API keys and authentication steps
- Configuration for each tool integration
- Field mappings and data structure
- Testing checklist before going live

**Example Data Flow**:
- Sample input data
- How data transforms at each step
- Expected output format
- Edge cases handled

**Conditional Logic Rules**:
- All branching scenarios documented
- Filter conditions specified
- Decision criteria explained
- Alternative paths defined

**Error Handling Strategy**:
- What can go wrong at each step
- Error notifications setup
- Retry logic and limits
- Fallback actions
- Manual intervention triggers

**Alternative Approaches**:
- 2-3 variations of the workflow
- Trade-offs between approaches
- Simpler vs. more robust options

**Tool Alternatives**:
- Suggestions if primary tools are not available
- Free vs. paid tool options

**Testing Plan**:
- Test scenarios to validate
- What to check at each step
- How to troubleshoot issues

**Optimization Tips**:
- Performance improvements
- Cost reduction opportunities
- Scaling considerations

**Code Snippets** (if custom code needed):
- Webhook handlers
- Data transformation functions
- API call examples

**Estimated Setup Time**: Hours needed to implement
**Monthly Cost Estimate**: Based on tool pricing tiers
**Maintenance Notes**: What to monitor and update$agentdata$,
  '[
    "When a new lead submits our website form, create a Slack notification, add them to HubSpot CRM, send a welcome email via Mailchimp, and create a task in Asana",
    "Automate invoice processing: when Stripe payment succeeds, update Google Sheet, send receipt via Gmail, and notify accountant in Slack",
    "When someone schedules a meeting via Calendly, create Zoom link, add to Google Calendar, send confirmation email with prep materials, and post reminder in team Slack channel 1 hour before",
    "Monitor mentions of our brand on Twitter, filter for positive sentiment, save to Airtable, and post weekly summary to team Slack channel",
    "When e-commerce order is placed in Shopify, validate inventory in Google Sheets, send order to fulfillment partner via API, update customer in email sequence, and log revenue in tracking dashboard"
  ]'::jsonb,
  'pro',
  64.99,
  10,
  '[
    "Visual workflow flowcharts",
    "Multi-tool integration design",
    "Conditional logic and branching",
    "Data transformation and mapping",
    "Error handling and retry logic",
    "Platform-specific implementation guides (Zapier, Make.com, n8n)",
    "Testing strategies and validation",
    "Alternative workflow suggestions",
    "Code snippets for custom integrations",
    "API endpoint recommendations",
    "Cost and time estimates",
    "Optimization recommendations",
    "Troubleshooting guides"
  ]'::jsonb,
  true,
  89
);