import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import type { Book } from '../../types';

interface AudioUploadProps {
  book: Book;
  onUploadComplete: (audioUrl: string) => void;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({ book, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept audio files
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${book.id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('book-audio')
        .upload(fileName, file);

      if (error) throw error;

      const audioUrl = supabase.storage
        .from('book-audio')
        .getPublicUrl(data.path).data.publicUrl;

      // Update book with new audio URL
      const { error: updateError } = await supabase
        .from('books')
        .update({
          audio_url: audioUrl,
          audio_format: file.type,
          audio_size: file.size
        })
        .eq('id', book.id);

      if (updateError) throw updateError;

      onUploadComplete(audioUrl);
      toast.success('Audio file uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload audio file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Audio File</label>
      <div className="mt-1 flex items-center">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {isUploading && (
          <div className="ml-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
};