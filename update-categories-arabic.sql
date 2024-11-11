-- First, remove existing categories
DELETE FROM categories;

-- Insert new categories with Arabic names
INSERT INTO categories (name, slug, description, icon) VALUES
('فكر وفلسفة', 'philosophy', 'كتب في الفكر والفلسفة', 'https://api.iconify.design/heroicons:light-bulb-solid.svg'),
('علوم وتكنولوجيا', 'science-tech', 'كتب في العلوم والتكنولوجيا', 'https://api.iconify.design/heroicons:computer-desktop-solid.svg'),
('الإدارة وريادة الأعمال', 'business', 'كتب في الإدارة وريادة الأعمال', 'https://api.iconify.design/heroicons:briefcase-solid.svg'),
('تاريخ', 'history', 'كتب في التاريخ', 'https://api.iconify.design/heroicons:clock-solid.svg'),
('تطوير الذات', 'self-development', 'كتب في تطوير الذات', 'https://api.iconify.design/heroicons:arrow-trending-up-solid.svg'),
('علم نفس', 'psychology', 'كتب في علم النفس', 'https://api.iconify.design/heroicons:brain-solid.svg'),
('أدب', 'literature', 'كتب في الأدب', 'https://api.iconify.design/heroicons:book-open-solid.svg'),
('مال واقتصاد', 'economics', 'كتب في المال والاقتصاد', 'https://api.iconify.design/heroicons:banknotes-solid.svg'),
('صحة وأسلوب حياة', 'health', 'كتب في الصحة وأسلوب الحياة', 'https://api.iconify.design/heroicons:heart-solid.svg'),
('إسلاميات', 'islamic', 'كتب في الإسلاميات', 'https://api.iconify.design/heroicons:moon-solid.svg'),
('الأسرة والطفولة', 'family', 'كتب في الأسرة والطفولة', 'https://api.iconify.design/heroicons:home-solid.svg'),
('سياسة وأمن', 'politics', 'كتب في السياسة والأمن', 'https://api.iconify.design/heroicons:globe-alt-solid.svg'),
('سير ذاتية ومذكرات', 'biography', 'كتب في السير الذاتية والمذكرات', 'https://api.iconify.design/heroicons:user-solid.svg'),
('أديان وروحانيات', 'religion', 'كتب في الأديان والروحانيات', 'https://api.iconify.design/heroicons:sparkles-solid.svg'),
('بيئة وطبيعة', 'environment', 'كتب في البيئة والطبيعة', 'https://api.iconify.design/heroicons:tree-solid.svg'),
('ثقافة ومجتمع', 'culture', 'كتب في الثقافة والمجتمع', 'https://api.iconify.design/heroicons:users-solid.svg');