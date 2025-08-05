import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/Slices/userSlices';
import likeReducer from '../Redux/Slices/Thunks/likesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    likes:likeReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
