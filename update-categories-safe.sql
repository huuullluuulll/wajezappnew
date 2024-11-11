-- First, update existing categories with new Arabic names and icons
UPDATE categories SET
  name = CASE slug
    WHEN 'business' THEN 'الإدارة وريادة الأعمال'
    WHEN 'psychology' THEN 'علم نفس'
    WHEN 'technology' THEN 'علوم وتكنولوجيا'
    WHEN 'personal-development' THEN 'تطوير الذات'
    WHEN 'leadership' THEN 'قيادة'
  END,
  description = CASE slug
    WHEN 'business' THEN 'كتب في الإدارة وريادة الأعمال'
    WHEN 'psychology' THEN 'كتب في علم النفس'
    WHEN 'technology' THEN 'كتب في العلوم والتكنولوجيا'
    WHEN 'personal-development' THEN 'كتب في تطوير الذات'
    WHEN 'leadership' THEN 'كتب في القيادة'
  END,
  icon = CASE slug
    WHEN 'business' THEN 'https://api.iconify.design/heroicons:briefcase-solid.svg'
    WHEN 'psychology' THEN 'https://api.iconify.design/heroicons:brain-solid.svg'
    WHEN 'technology' THEN 'https://api.iconify.design/heroicons:computer-desktop-solid.svg'
    WHEN 'personal-development' THEN 'https://api.iconify.design/heroicons:arrow-trending-up-solid.svg'
    WHEN 'leadership' THEN 'https://api.iconify.design/heroicons:user-group-solid.svg'
  END
WHERE slug IN ('business', 'psychology', 'technology', 'personal-development', 'leadership');

-- Insert only new categories
INSERT INTO categories (name, slug, description, icon)
SELECT * FROM (VALUES
  ('فكر وفلسفة', 'philosophy', 'كتب في الفكر والفلسفة', 'https://api.iconify.design/heroicons:light-bulb-solid.svg'),
  ('تاريخ', 'history', 'كتب في التاريخ', 'https://api.iconify.design/heroicons:clock-solid.svg'),
  ('أدب', 'literature', 'كتب في الأدب', 'https://api.iconify.design/heroicons:book-open-solid.svg'),
  ('مال واقتصاد', 'economics', 'كتب في المال والاقتصاد', 'https://api.iconify.design/heroicons:banknotes-solid.svg'),
  ('صحة وأسلوب حياة', 'health', 'كتب في الصحة وأسلوب الحياة', 'https://api.iconify.design/heroicons:heart-solid.svg'),
  ('إسلاميات', 'islamic', 'كتب في الإسلاميات', 'https://api.iconify.design/heroicons:moon-solid.svg'),
  ('الأسرة والطفولة', 'family', 'كتب في الأسرة والطفولة', 'https://api.iconify.design/heroicons:home-solid.svg'),
  ('سياسة وأمن', 'politics', 'كتب في السياسة والأمن', 'https://api.iconify.design/heroicons:globe-alt-solid.svg'),
  ('سير ذاتية ومذكرات', 'biography', 'كتب في السير الذاتية والمذكرات', 'https://api.iconify.design/heroicons:user-solid.svg'),
  ('أديان وروحانيات', 'religion', 'كتب في الأديان والروحانيات', 'https://api.iconify.design/heroicons:sparkles-solid.svg'),
  ('بيئة وطبيعة', 'environment', 'كتب في البيئة والطبيعة', 'https://api.iconify.design/heroicons:tree-solid.svg'),
  ('ثقافة ومجتمع', 'culture', 'كتب في الثقافة والمجتمع', 'https://api.iconify.design/heroicons:users-solid.svg')
) AS new_categories(name, slug, description, icon)
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE categories.slug = new_categories.slug
);