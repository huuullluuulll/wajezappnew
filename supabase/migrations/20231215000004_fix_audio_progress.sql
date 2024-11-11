-- First ensure the audio_progress table has all required columns
ALTER TABLE audio_progress
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS total_listen_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Recreate the function to handle progress updates
CREATE OR REPLACE FUNCTION calculate_audio_progress()
RETURNS TRIGGER AS $$
DECLARE
    book_duration INTEGER;
BEGIN
    -- Get book duration
    SELECT audio_duration INTO book_duration
    FROM books
    WHERE id = NEW.book_id;

    -- Calculate progress percentage
    IF book_duration > 0 THEN
        NEW.progress_percentage := (NEW.current_position::DECIMAL / book_duration::DECIMAL) * 100;
    ELSE
        NEW.progress_percentage := 0;
    END IF;

    -- Update completion status
    IF NEW.progress_percentage >= 90 THEN
        NEW.is_completed := true;
        NEW.completed_at := CURRENT_TIMESTAMP;
    ELSE
        NEW.is_completed := false;
        NEW.completed_at := NULL;
    END IF;

    -- Calculate listen time
    IF TG_OP = 'UPDATE' THEN
        IF NEW.current_position > OLD.current_position THEN
            NEW.total_listen_time := COALESCE(OLD.total_listen_time, 0) + (NEW.current_position - OLD.current_position);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS audio_progress_calculator ON audio_progress;

-- Create new trigger
CREATE TRIGGER audio_progress_calculator
    BEFORE INSERT OR UPDATE OF current_position
    ON audio_progress
    FOR EACH ROW
    EXECUTE FUNCTION calculate_audio_progress();