import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    favorites: favoritesReducer, // Add favorites reducer
    // Add other reducers as needed
  }
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
