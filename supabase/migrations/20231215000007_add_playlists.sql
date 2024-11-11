-- Create playlists table with enhanced fields
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_url TEXT,
  background_color TEXT NOT NULL DEFAULT '#1A1A1A',
  accent_color TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create playlist_books junction table
CREATE TABLE IF NOT EXISTS playlist_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(playlist_id, book_id)
);

-- Create indexes
CREATE INDEX idx_playlists_slug ON playlists(slug);
CREATE INDEX idx_playlists_featured ON playlists(is_featured) WHERE is_featured = true;
CREATE INDEX idx_playlist_books_playlist ON playlist_books(playlist_id);
CREATE INDEX idx_playlist_books_position ON playlist_books(playlist_id, position);

-- Insert sample playlists with modern designs
INSERT INTO playlists (title, subtitle, description, background_color, accent_color, slug, is_featured) VALUES
('مهارات البيع والتداول', 'للنجاح والتفوق في عالم الأعمال', 'مجموعة من أفضل الكتب التي تساعدك في تطوير مهارات البيع والتداول', '#1B4332', '#90BE6D', 'sales-and-trading', true),
('أساسيات الفلسفة', 'لفهم الحياة والقوة والذات', 'رحلة في عالم الفلسفة من خلال أهم الكتب الفلسفية', '#3C096C', '#9D4EDD', 'philosophy-essentials', true),
('فن قراءة الناس', 'أثّر، أقنع، انجح', 'تعلم مهارات قراءة لغة الجسد وفهم الآخرين', '#5B21B6', '#7C3AED', 'how-to-read-people', true),
('فكر كرئيس تنفيذي', 'خطط، أنجز، انجح', 'استراتيجيات وأفكار من أنجح الرؤساء التنفيذيين', '#92400E', '#D97706', 'think-like-ceo', true),
('كيفية تكوين العادات', 'خطوات صغيرة لتغيير دائم', 'دليلك العملي لتكوين عادات إيجابية تدوم', '#C2410C', '#FB923C', 'how-to-create-habits', true),
('دليل التخلص من الإدمان الرقمي', 'تخلص من إدمان وسائل التواصل', 'استعد حياتك من إدمان الهواتف ووسائل التواصل', '#4B5563', '#9CA3AF', 'digital-detox', true),
('برمج عقلك للسعادة', 'لحياة أكثر سعادة وازدهار', 'تقنيات وأساليب علمية للتحكم في عقلك وتحقيق السعادة', '#BE185D', '#EC4899', 'hack-your-brain', true),
('التحكم في القلق', 'توقف عن القلق وجد سلامك الداخلي', 'أدوات عملية للتغلب على القلق والتوتر', '#2563EB', '#60A5FA', 'managing-anxiety', true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();