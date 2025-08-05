import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LikeItem } from '../../../component/AppTypes/User';

interface LikesState {
    likedUserIds: string[];        // Just IDs for quick toggle
    userILiked: LikeItem[];         // Detailed info of users I liked
    getUsersWhoLikedMe: LikeItem[];
    likedCount: number;      // total liked users count
    likedMeCount: number;    // total users who liked me count
  }
  
  const likesSlice = createSlice({
    name: "likes",
    initialState: {
      likedUserIds: [],
      userILiked: [],
      getUsersWhoLikedMe: [],
      likedCount: 0,
      likedMeCount: 0,
    } as LikesState,
    reducers: {
      setLikedCount: (state, action: PayloadAction<number>) => {
        state.likedCount = action.payload;
      },
      setLikedMeCount: (state, action: PayloadAction<number>) => {
        state.likedMeCount = action.payload;
      },
    },
  });
  
  export const { setLikedCount, setLikedMeCount } = likesSlice.actions;
  export default likesSlice.reducer;