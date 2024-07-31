import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import EpisodeList from './EpisodeList';
import { genreMapping } from './GenreMapping/genreMapping';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../favoritesSlice';
import { RootState } from '../store';
import '../styles/ShowDetail.css';

interface Episode {
  id: string;
  title: string;
  description: string;
  file: string;
  showTitle: string;
  seasons: string;
  addedAt: string;
}

interface Season {
  id: string;
  title: string;
  number: number;
  episodes: Episode[];
}

interface Show {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Season[];
  genres?: number[];
}

const ShowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);

  // Fetch show details when component mounts or id changes
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
        const fetchedShow: Show = response.data;

        // Sort seasons by number and prepare episodes
        fetchedShow.seasons.sort((a, b) => a.number - b.number);
        fetchedShow.seasons.forEach(season => {
          season.episodes = season.episodes.map((episode, index) => ({
            ...episode,
            title: `Episode: ${index + 1} - ${episode.title}`,
            showTitle: fetchedShow.title,
            seasons: season.title,
            addedAt: new Date().toISOString(),
          }));
        });

        setShow(fetchedShow);
        setCurrentSeason(fetchedShow.seasons[0]);
      } catch {
        setError('Failed to load show details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShow();
    }
  }, [id]);

  // Handle season change
  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeasonId = e.target.value;
    const selectedSeason = show?.seasons.find(season => season.id === selectedSeasonId) || null;
    setCurrentSeason(selectedSeason);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (episode: Episode) => {
    dispatch(toggleFavorite(episode));
  };

  // Check if episode is a favorite
  const isFavorite = (episodeId: string) => favorites.some(episode => episode.id === episodeId);

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="show-detail">
      {/* Back button */}
      <Link to="/" style={{ color: 'white', fontWeight: 'bold' }}>
        <button style={{ margin: '7px', backgroundColor: '#333' }}>Go Back</button>
      </Link>

      {show && (
        <div>
          <img src={show.image} alt={show.title} className="showImage" />
          <div className="show-info">
            <h1 style={{ color: '#787bd3', fontSize:'medium' }}>{show.title}</h1>
            <p className="show-description">{show.description}</p>
            {show.genres && (
              <p>Genres: {show.genres.map(id => genreMapping[id]).join(', ')}</p>
            )}
          </div>

          <h2 style={{ color: '#ddd', fontSize: '18px'}}>Select Season:</h2>
          <select onChange={handleSeasonChange} value={currentSeason?.id || ''}>
            {show.seasons.map(season => (
              <option key={season.id} value={season.id}>
                {season.title}
              </option>
            ))}
          </select>

          {currentSeason && (
            <EpisodeList
              episodes={currentSeason.episodes.map(episode => ({
                ...episode,
                isFavorite: isFavorite(episode.id),
                handleToggleFavorite: () => handleToggleFavorite(episode)
              }))}
            />
          )}

          {/* Link to Favorites */}
          <button>
            <Link to="/favorites">Open Favorites</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowDetail;
