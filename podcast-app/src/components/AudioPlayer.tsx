import React, { useRef, useEffect } from 'react';
import '../styles/AudioPlayer.css';

interface AudioPlayerProps {
  src: string;
  episodeId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, episodeId }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Restore playback position from localStorage when component mounts
  useEffect(() => {
    const storedTime = localStorage.getItem(`progress-${episodeId}`);
    if (storedTime && audioRef.current) {
      audioRef.current.currentTime = parseFloat(storedTime);
    }

    // Save playback position to localStorage before the window unloads
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        localStorage.setItem(`progress-${episodeId}`, audioRef.current.currentTime.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [episodeId]);

  // Save the ID of the last listened episode to localStorage when the audio starts playing
  const handlePlay = () => {
    localStorage.setItem('lastListenedEpisode', episodeId);
  };

  // Mark episode as completed and remove playback position when playback ends
  const handleEnded = () => {
    localStorage.removeItem(`progress-${episodeId}`);
    const completedEpisodes = JSON.parse(localStorage.getItem('completedEpisodes') || '[]');
    const updatedCompleted = [...completedEpisodes, episodeId];
    localStorage.setItem('completedEpisodes', JSON.stringify(updatedCompleted));
  };

  return (
    <div className='AudioPlayer'>
      <audio
        ref={audioRef}
        controls
        src={src}
        onPlay={handlePlay}
        onEnded={handleEnded}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
