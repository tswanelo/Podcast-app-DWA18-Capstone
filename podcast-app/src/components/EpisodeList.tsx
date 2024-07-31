import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../favoritesSlice';
import { RootState } from '../store';
import '../styles/EpisodeList.css';
import favoriteIcon from '../Icons/icons/heart.png'; 
import favoritedIcon from '../Icons/icons/favorite.png'; 
import AudioPlayer from './AudioPlayer';

// Define the Episode interface for type safety
export interface Episode {
  id: string;
  title: string;
  description: string;
  file: string;
  showTitle: string;
  seasons: string;
  addedAt: string;
}

interface EpisodeListProps {
  episodes: Episode[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  const dispatch = useDispatch();
  // Get the list of favorite episodes from the Redux store
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  // Initialize the favorite status of each episode
  const [favoriteStatus, setFavoriteStatus] = useState<{ [key: string]: boolean }>(
    episodes.reduce((acc, episode) => {
      acc[episode.id] = favorites.some((fav) => fav.id === episode.id);
      return acc;
    }, {} as { [key: string]: boolean })
  );

  // Toggle the favorite status of an episode
  const handleAddToFavorites = (episode: Episode) => {
    dispatch(toggleFavorite(episode));
    setFavoriteStatus((prevStatus) => ({
      ...prevStatus,
      [episode.id]: !prevStatus[episode.id],
    }));
  };

  return (
    <div className="episode-list">
      <h2 style={{fontSize:'18px'}}>Episode List</h2>
      <ul className="episodes">
        {episodes.map((episode) => (
          <li key={episode.id} className="episode-item">
            <h4>{episode.title}</h4>
            <p style={{ color: 'white', fontSize:'small' }}>{episode.description}</p>
            <AudioPlayer src={episode.file} episodeId={episode.id} />
            <div className='addtofavorites-btn'>
              <button
                style={{ backgroundColor: '#444' }} // Button background color
                onClick={() => handleAddToFavorites(episode)}
              >
                <img
                  src={favoriteStatus[episode.id] ? favoritedIcon : favoriteIcon}
                  alt="Favorite Icon"
                  style={{ width: '15px', float: 'left' }} // Icon size and alignment
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodeList;
