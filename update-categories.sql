-- Update categories with icons
UPDATE categories
SET icon = CASE
  WHEN slug = 'business' THEN 'https://api.iconify.design/heroicons:briefcase-solid.svg'
  WHEN slug = 'personal-development' THEN 'https://api.iconify.design/heroicons:arrow-trending-up-solid.svg'
  WHEN slug = 'psychology' THEN 'https://api.iconify.design/heroicons:brain-solid.svg'
  WHEN slug = 'technology' THEN 'https://api.iconify.design/heroicons:computer-desktop-solid.svg'
  WHEN slug = 'leadership' THEN 'https://api.iconify.design/heroicons:user-group-solid.svg'
END
WHERE slug IN ('business', 'personal-development', 'psychology', 'technology', 'leadership');