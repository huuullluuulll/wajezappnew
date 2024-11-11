-- Enhance audio_progress table
ALTER TABLE audio_progress
ADD COLUMN IF NOT EXISTS total_duration INTEGER,
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS last_position INTEGER,
ADD COLUMN IF NOT EXISTS completion_status TEXT CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
ADD COLUMN IF NOT EXISTS total_listen_time INTEGER DEFAULT 0;

-- Create function to calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_progress()
RETURNS TRIGGER AS $$
DECLARE
    book_duration INTEGER;
BEGIN
    -- Get book duration
    SELECT audio_duration INTO book_duration
    FROM books
    WHERE id = NEW.book_id;

    -- Set total duration
    NEW.total_duration := book_duration;

    -- Calculate progress percentage
    IF book_duration > 0 THEN
        NEW.progress_percentage := (NEW.current_position::DECIMAL / book_duration::DECIMAL) * 100;
    ELSE
        NEW.progress_percentage := 0;
    END IF;

    -- Update completion status
    IF NEW.current_position = 0 THEN
        NEW.completion_status := 'not_started';
    ELSIF NEW.progress_percentage >= 90 THEN
        NEW.completion_status := 'completed';
        IF NOT NEW.is_completed THEN
            NEW.is_completed := true;
            NEW.completed_at := CURRENT_TIMESTAMP;
        END IF;
    ELSE
        NEW.completion_status := 'in_progress';
        NEW.is_completed := false;
        NEW.completed_at := NULL;
    END IF;

    -- Calculate listen time delta
    IF TG_OP = 'UPDATE' THEN
        IF NEW.current_position > OLD.current_position THEN
            NEW.total_listen_time := OLD.total_listen_time + (NEW.current_position - OLD.current_position);
        END IF;
    END IF;

    -- Store last position
    NEW.last_position := NEW.current_position;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS audio_progress_calculator ON audio_progress;

-- Create new trigger for progress calculation
CREATE TRIGGER audio_progress_calculator
    BEFORE INSERT OR UPDATE OF current_position
    ON audio_progress
    FOR EACH ROW
    EXECUTE FUNCTION calculate_progress();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audio_progress_user_completion 
ON audio_progress(user_id, completion_status);

CREATE INDEX IF NOT EXISTS idx_audio_progress_completed 
ON audio_progress(user_id, is_completed) 
WHERE is_completed = true;

CREATE INDEX IF NOT EXISTS idx_audio_progress_in_progress 
ON audio_progress(user_id, completion_status) 
WHERE completion_status = 'in_progress';

-- Create view for user progress statistics
CREATE OR REPLACE VIEW user_progress_stats AS
SELECT 
    user_id,
    COUNT(*) FILTER (WHERE completion_status = 'completed') as completed_books,
    COUNT(*) FILTER (WHERE completion_status = 'in_progress') as books_in_progress,
    SUM(total_listen_time) as total_listen_time_seconds,
    AVG(progress_percentage) FILTER (WHERE completion_status = 'in_progress') as avg_progress_percentage
FROM audio_progress
GROUP BY user_id;

-- Add function to get user's reading streak
CREATE OR REPLACE FUNCTION get_user_reading_streak(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0;
    last_date DATE := NULL;
BEGIN
    WITH RECURSIVE dates AS (
        SELECT DATE(last_played_at) as play_date
        FROM audio_progress
        WHERE user_id = user_id_param
        GROUP BY DATE(last_played_at)
        ORDER BY DATE(last_played_at) DESC
    ),
    streak_calc AS (
        SELECT play_date, 1 as streak
        FROM dates
        WHERE play_date = CURRENT_DATE
        
        UNION ALL
        
        SELECT d.play_date, s.streak + 1
        FROM dates d
        INNER JOIN streak_calc s ON d.play_date = s.play_date - INTERVAL '1 day'
    )
    SELECT COALESCE(MAX(streak), 0) INTO streak
    FROM streak_calc;
    
    RETURN streak;
END;
$$ LANGUAGE plpgsql;