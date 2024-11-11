-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS audio_progress_calculator ON audio_progress;
DROP TRIGGER IF EXISTS book_completion_handler ON audio_progress;
DROP FUNCTION IF EXISTS calculate_audio_progress();
DROP FUNCTION IF EXISTS handle_book_completion();

-- Create enhanced progress calculation function
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
        IF OLD IS NULL OR NOT OLD.is_completed THEN
            NEW.completed_at := CURRENT_TIMESTAMP;
        END IF;
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

-- Create enhanced book completion handler
CREATE OR REPLACE FUNCTION handle_book_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- When a book is marked as completed
    IF NEW.is_completed AND (OLD IS NULL OR NOT OLD.is_completed) THEN
        -- Insert or update finished_books
        INSERT INTO finished_books (
            user_id,
            book_id,
            completed_at,
            total_listen_time
        )
        VALUES (
            NEW.user_id,
            NEW.book_id,
            NEW.completed_at,
            NEW.total_listen_time
        )
        ON CONFLICT (user_id, book_id) 
        DO UPDATE SET 
            total_listen_time = EXCLUDED.total_listen_time,
            completed_at = EXCLUDED.completed_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER audio_progress_calculator
    BEFORE INSERT OR UPDATE OF current_position
    ON audio_progress
    FOR EACH ROW
    EXECUTE FUNCTION calculate_audio_progress();

CREATE TRIGGER book_completion_handler
    AFTER INSERT OR UPDATE OF is_completed
    ON audio_progress
    FOR EACH ROW
    EXECUTE FUNCTION handle_book_completion();

-- Update existing records
UPDATE audio_progress
SET 
    progress_percentage = (current_position::DECIMAL / (
        SELECT audio_duration 
        FROM books 
        WHERE books.id = audio_progress.book_id
    )::DECIMAL) * 100,
    is_completed = CASE 
        WHEN (current_position::DECIMAL / (
            SELECT audio_duration 
            FROM books 
            WHERE books.id = audio_progress.book_id
        )::DECIMAL) * 100 >= 90 
        THEN true 
        ELSE false 
    END,
    completed_at = CASE 
        WHEN (current_position::DECIMAL / (
            SELECT audio_duration 
            FROM books 
            WHERE books.id = audio_progress.book_id
        )::DECIMAL) * 100 >= 90 
        THEN CURRENT_TIMESTAMP 
        ELSE NULL 
    END
WHERE progress_percentage IS NULL;