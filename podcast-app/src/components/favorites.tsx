import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import icons from '../Icons/icons/studio2.png';
import {removeFavorite, sortFavoritesByTitleAZ, sortFavoritesByTitleZA, sortFavoritesByDateAsc, sortFavoritesByDateDesc,} from '../favoritesSlice';
import '../styles/Favorites.css';

const Favorites: React.FC = () => {
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate for navigation

  // Handler functions for sorting and removing favorites
  const handleSortTitleAZ = () => dispatch(sortFavoritesByTitleAZ());
  const handleSortTitleZA = () => dispatch(sortFavoritesByTitleZA());
  const handleSortDateAsc = () => dispatch(sortFavoritesByDateAsc());
  const handleSortDateDesc = () => dispatch(sortFavoritesByDateDesc());
  const handleRemoveFromFavorites = (episodeId: string) => {
    dispatch(removeFavorite(episodeId));
  };

  // Handler function to reset progress
  const handleResetProgress = () => {
    localStorage.clear();
    window.location.reload(); 
  };

  return (
    <div className="favorites">
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{ float: 'right', backgroundColor: '#333', margin:'10px'}}>
        BACK
      </button>
      
      {/* Home icon link */}
      <Link to="/">
        <img src={icons} alt="Home Icon" style={{display:'flex', float:'left', maxWidth:'30px', margin:'10px'}} />
      </Link>
      
      <h2 style={{fontSize:'medium', marginTop:'40px'}}>Favorites</h2>

      {/* Sorting buttons */}
      <div className="sort-buttons">
        <button onClick={handleSortTitleAZ}>A-Z</button>
        <button onClick={handleSortTitleZA}>Z-A</button>
        <button onClick={handleSortDateAsc}>Date Asc</button>
        <button onClick={handleSortDateDesc}>Date Desc</button>
      </div>
      
      {/* List of favorite episodes */}
      <ul className="favorite-episodes">
        {favorites.map((episode) => (
          <li key={episode.id} className="favorite-item">
            <h4>{episode.title}</h4>
            <p style={{ color: 'white', fontSize:'small' }}>{episode.description}</p>
            <audio controls>
              <source src={episode.file} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <p style={{fontSize:'15px', margin:'12px'}}>Added at: {new Date(episode.addedAt).toLocaleString()}</p>
            <div className='Remove-btn'>
              <button onClick={() => handleRemoveFromFavorites(episode.id)}>
                Remove from Favorites
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Reset progress button */}
      <button onClick={handleResetProgress}>Reset Progress</button>
    </div>
  );
};

export default Favorites;
