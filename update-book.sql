UPDATE books 
SET audio_url = 'https://tgpfgdlntbhkshpybnrj.supabase.co/storage/v1/object/public/book-audio/audiobook.mp3',
    audio_format = 'mp3',
    audio_duration = 1800,
    audio_size = 5000000
WHERE id = '376c329c-f462-435e-b428-e12027dd9b96';