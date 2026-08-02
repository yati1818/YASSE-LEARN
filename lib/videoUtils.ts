export interface ParsedVideo {
  isValid: boolean;
  videoType: 'youtube' | 'uploaded_file';
  embedUrl: string;
  thumbnailUrl: string;
  videoId?: string;
  errorMessage?: string;
}

export function parseYouTubeUrl(url: string): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      videoType: 'youtube',
      embedUrl: '',
      thumbnailUrl: '',
      errorMessage: 'Invalid URL provided.',
    };
  }

  const cleanUrl = url.trim();

  // If it's a blob/object URL for uploaded video files
  if (cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:video') || cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm')) {
    return {
      isValid: true,
      videoType: 'uploaded_file',
      embedUrl: cleanUrl,
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    };
  }

  // Regex for YouTube video IDs (supports youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, shorts/ID)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return {
      isValid: true,
      videoType: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // Fallback for valid embeds
  if (cleanUrl.includes('youtube.com/embed/')) {
    return {
      isValid: true,
      videoType: 'youtube',
      embedUrl: cleanUrl,
      thumbnailUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
    };
  }

  return {
    isValid: false,
    videoType: 'youtube',
    embedUrl: '',
    thumbnailUrl: '',
    errorMessage: 'Please enter a valid YouTube video link (e.g. https://www.youtube.com/watch?v=...) or upload a video file.',
  };
}
