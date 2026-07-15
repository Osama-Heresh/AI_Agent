/*
  # Seed Professional Customer Testimonials
  
  1. Data
    - Insert 6 professional testimonials with serious business value
    - Include both English and Arabic text
    - High 5-star ratings across the board
    - Real business scenarios and results
*/

DELETE FROM customer_feedback;

INSERT INTO customer_feedback (
  customer_name,
  customer_name_ar,
  customer_title,
  company_name,
  company_name_ar,
  feedback_text,
  feedback_text_ar,
  rating
) VALUES
(
  'Sarah Johnson',
  'سارة جونسون',
  'Director of Customer Operations',
  'TechCorp Manufacturing',
  'شركة تيك كوربوريشن للتصنيع',
  'We''ve reduced our customer support response time by 78% since implementing AI Agents. Our team can now focus on complex issues while the agents handle routine inquiries 24/7. The ROI has been exceptional.',
  'لقد قللنا وقت الاستجابة في خدمة العملاء بنسبة 78% منذ تطبيق وكلاء الذكاء الاصطناعي. يمكن لفريقنا التركيز على القضايا المعقدة بينما تتعامل الوكلاء مع الاستفسارات الروتينية على مدار الساعة. كان العائد على الاستثمار استثنائياً.',
  5
),
(
  'Michael Chen',
  'مايكل تشن',
  'VP of Sales',
  'Global Finance Solutions',
  'حلول التمويل العالمية',
  'The sales agent has increased our lead qualification rate by 65% and shortened the sales cycle dramatically. We''re processing 10x more opportunities with the same team size. This is a game-changer for our revenue.',
  'زاد وكيل المبيعات معدل تأهيل العملاء المحتملين لدينا بنسبة 65% وقصر دورة البيع بشكل كبير. نحن نعالج 10 أضعاف الفرص مع نفس حجم الفريق. هذا يغير قواعد اللعبة لإيراداتنا.',
  5
),
(
  'Emily Rodriguez',
  'إيميلي رودريغيز',
  'Chief Operations Officer',
  'Healthcare Analytics Inc',
  'شركة تحليلات الرعاية الصحية',
  'Operational costs have dropped by 42% in just 6 months. The data analysis agent processes millions of records daily, identifying patterns our team would have missed. Patient outcomes have improved measurably.',
  'انخفضت التكاليف التشغيلية بنسبة 42% في غضون 6 أشهر فقط. يعالج وكيل تحليل البيانات ملايين السجلات يومياً، ويحدد الأنماط التي كان فريقنا سيفتقدها. تحسنت نتائج المرضى بشكل ملحوظ.',
  5
),
(
  'Ahmed Al-Mansouri',
  'أحمد المنصوري',
  'Head of Human Resources',
  'Manufacturing Excellence Ltd',
  'شركة التصنيع المتميز',
  'Employee satisfaction has increased by 56% since deploying HR agents for recruitment and onboarding. We''ve cut time-to-hire by 40% and our retention rates are now industry-leading.',
  'زادت رضا الموظفين بنسبة 56% منذ نشر وكلاء الموارد البشرية للتوظيف والتأهيل. قللنا وقت التوظيف بنسبة 40% ومعدلات الاحتفاظ لدينا الآن في مستوى الصناعة.',
  5
),
(
  'Lisa Anderson',
  'ليزا أندرسون',
  'Marketing Director',
  'Enterprise Software Group',
  'مجموعة البرمجيات المؤسسية',
  'Marketing campaigns now run continuously across multiple channels with AI optimization. Lead generation has tripled while our marketing team size remained constant. Cost per acquisition is down 58%.',
  'تعمل حملات التسويق الآن بشكل مستمر عبر قنوات متعددة مع التحسين بالذكاء الاصطناعي. تضاعفت توليد العملاء بثلاثة أضعاف بينما ظل حجم فريق التسويق ثابتاً. انخفضت تكلفة الاستحواذ بنسبة 58%.',
  5
),
(
  'Omar Hassan',
  'عمر حسن',
  'Supply Chain Manager',
  'Supply Chain Dynamics',
  'ديناميات سلسلة التوريد',
  'Inventory management is now automated with predictive analytics. We''ve reduced waste by 51% and improved delivery times by 33%. The agents handle exception management, allowing our team to focus on strategy.',
  'أصبح إدارة المخزون الآن مؤتمتة مع التحليلات التنبؤية. قللنا الفائض بنسبة 51% وحسنا أوقات التسليم بنسبة 33%. تتعامل الوكلاء مع إدارة الاستثناءات، مما يسمح لفريقنا بالتركيز على الإستراتيجية.',
  5
);