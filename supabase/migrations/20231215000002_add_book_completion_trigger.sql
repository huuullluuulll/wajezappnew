-- Add completed_at column to audio_progress table
ALTER TABLE audio_progress
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

-- Create function to check book completion
CREATE OR REPLACE FUNCTION check_book_completion()
RETURNS TRIGGER AS $$
DECLARE
    book_duration INTEGER;
BEGIN
    -- Get book duration
    SELECT audio_duration INTO book_duration
    FROM books
    WHERE id = NEW.book_id;

    -- Check if progress is >= 90%
    IF book_duration IS NOT NULL AND NEW.current_position >= (book_duration * 0.9) THEN
        -- Mark as completed if not already completed
        IF NOT NEW.is_completed THEN
            NEW.is_completed := true;
            NEW.completed_at := CURRENT_TIMESTAMP;
        END IF;
    ELSE
        -- Reset completion status if progress drops below 90%
        NEW.is_completed := false;
        NEW.completed_at := NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for book completion
DROP TRIGGER IF EXISTS book_completion_trigger ON audio_progress;
CREATE TRIGGER book_completion_trigger
    BEFORE INSERT OR UPDATE OF current_position
    ON audio_progress
    FOR EACH ROW
    EXECUTE FUNCTION check_book_completion();