-- Add icon column to categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS icon VARCHAR;