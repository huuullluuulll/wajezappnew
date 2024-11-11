-- Create finished_books table
CREATE TABLE IF NOT EXISTS finished_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  total_listen_time INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  UNIQUE(user_id, book_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE finished_books ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view any finished book"
  ON finished_books FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own finished books"
  ON finished_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own finished books"
  ON finished_books FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX finished_books_user_id_idx ON finished_books(user_id);
CREATE INDEX finished_books_book_id_idx ON finished_books(book_id);
CREATE INDEX finished_books_completed_at_idx ON finished_books(completed_at);

-- Create function to automatically move completed books
CREATE OR REPLACE FUNCTION handle_book_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- When a book is marked as completed in audio_progress
    IF NEW.is_completed AND (OLD IS NULL OR NOT OLD.is_completed) THEN
        -- Insert into finished_books if not exists
        INSERT INTO finished_books (user_id, book_id, total_listen_time)
        VALUES (NEW.user_id, NEW.book_id, NEW.total_listen_time)
        ON CONFLICT (user_id, book_id) 
        DO UPDATE SET 
            total_listen_time = EXCLUDED.total_listen_time,
            completed_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic completion handling
DROP TRIGGER IF EXISTS book_completion_handler ON audio_progress;
CREATE TRIGGER book_completion_handler
    AFTER INSERT OR UPDATE OF is_completed
    ON audio_progress
    FOR EACH ROW
    EXECUTE FUNCTION handle_book_completion();