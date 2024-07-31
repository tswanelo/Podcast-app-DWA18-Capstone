import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Episode interface
export interface Episode {
  id: string;
  title: string;
  description: string;
  file: string;
  showTitle: string;
  seasons: string;
  addedAt: string;
}

// Define the initial state for favorites
interface FavoritesState {
  favorites: Episode[];
}

const initialState: FavoritesState = {
  favorites: [],
};

// Create a slice for favorites
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Toggle an episode in favorites
    toggleFavorite: (state, action: PayloadAction<Episode>) => {
      const episode = action.payload;
      const existingIndex = state.favorites.findIndex((fav) => fav.id === episode.id);
      if (existingIndex >= 0) {
        // Remove from favorites if already exists
        state.favorites.splice(existingIndex, 1);
      } else {
        // Add to favorites with current timestamp
        state.favorites.push({ ...episode, addedAt: new Date().toISOString() });
      }
    },
    // Remove a favorite by id
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((fav) => fav.id !== action.payload);
    },
    // Sort favorites by title A-Z
    sortFavoritesByTitleAZ: (state) => {
      state.favorites.sort((a, b) => a.showTitle.localeCompare(b.showTitle));
    },
    // Sort favorites by title Z-A
    sortFavoritesByTitleZA: (state) => {
      state.favorites.sort((a, b) => b.showTitle.localeCompare(a.showTitle));
    },
    // Sort favorites by date added ascending
    sortFavoritesByDateAsc: (state) => {
      state.favorites.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
    },
    // Sort favorites by date added descending
    sortFavoritesByDateDesc: (state) => {
      state.favorites.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    },
  },
});

// Export actions and reducer
export const { 
  toggleFavorite, 
  removeFavorite, 
  sortFavoritesByTitleAZ, 
  sortFavoritesByTitleZA, 
  sortFavoritesByDateAsc, 
  sortFavoritesByDateDesc 
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
