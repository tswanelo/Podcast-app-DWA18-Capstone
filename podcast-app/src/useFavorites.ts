import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { toggleFavorite, sortFavoritesByTitleAZ, sortFavoritesByTitleZA, sortFavoritesByDateAsc, sortFavoritesByDateDesc, Episode } from './favoritesSlice';

// Custom hook to manage favorites
export const useFavorites = () => {
  // Get favorites from the Redux store
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  // Get dispatch function from Redux
  const dispatch = useDispatch();

  // Check if an episode is a favorite
  const isFavorite = (id: string) => favorites.some((episode) => episode.id === id);

  // Toggle an episode as favorite
  const toggleFavoriteEpisode = (episode: Episode) => {
    dispatch(toggleFavorite(episode));
  };

  // Sorting functions
  const sortFavoritesAZ = () => dispatch(sortFavoritesByTitleAZ());
  const sortFavoritesZA = () => dispatch(sortFavoritesByTitleZA());
  const sortFavoritesDateAsc = () => dispatch(sortFavoritesByDateAsc());
  const sortFavoritesDateDesc = () => dispatch(sortFavoritesByDateDesc());

  // Return all state and functions
  return {
    favorites,
    isFavorite,
    toggleFavoriteEpisode,
    sortFavoritesAZ,
    sortFavoritesZA,
    sortFavoritesDateAsc,
    sortFavoritesDateDesc,
  };
};
