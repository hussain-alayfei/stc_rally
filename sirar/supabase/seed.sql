-- Seed Categories
INSERT INTO public.categories (id, name_ar, sensitivity_level, description_ar, examples, access_rules, color) VALUES
('A', 'فئة A', 'عالية الأمان', 'بيانات شديدة الحساسية تتطلب أعلى مستوى من الحماية والتقييد في الوصول.',
 '[{"icon":"id-card","label":"بيانات الهوية الشخصية"},{"icon":"wallet","label":"المعلومات المالية الحساسة"},{"icon":"heart-pulse","label":"البيانات الصحية الخاصة"}]',
 '[{"icon":"user-cog","label":"المدراء التنفيذيون فقط"},{"icon":"shield","label":"مدير النظام"}]',
 '#EF4444'),
('B', 'فئة B', 'متوسطة الأمان', 'بيانات حساسة تتطلب مستوى متوسط من الحماية مع إمكانية وصول محدودة.',
 '[{"icon":"users","label":"بيانات العملاء"},{"icon":"file-text","label":"سجلات العمليات الداخلية"},{"icon":"bar-chart","label":"التقارير المالية العامة"}]',
 '[{"icon":"user-cog","label":"مدراء الأقسام"},{"icon":"users","label":"الموظفون المصرح لهم"}]',
 '#F59E0B'),
('C', 'فئة C', 'منخفضة الأمان', 'بيانات عامة أو قليلة الحساسية متاحة لعدد أكبر من المستخدمين.',
 '[{"icon":"globe","label":"المحتوى العام"},{"icon":"file-text","label":"التقارير العامة"},{"icon":"folder","label":"المستندات المشتركة"}]',
 '[{"icon":"users","label":"جميع الموظفين"},{"icon":"user-check","label":"الضيوف المصرح لهم"}]',
 '#22C55E')
ON CONFLICT (id) DO NOTHING;

-- Seed Permissions
INSERT INTO public.permissions (role, category_id, can_view, can_export, can_modify) VALUES
('admin', 'A', true, true, true),
('admin', 'B', true, true, true),
('admin', 'C', true, true, true),
('manager', 'A', false, false, false),
('manager', 'B', true, true, false),
('manager', 'C', true, true, true),
('user', 'A', false, false, false),
('user', 'B', false, false, false),
('user', 'C', true, false, false);
