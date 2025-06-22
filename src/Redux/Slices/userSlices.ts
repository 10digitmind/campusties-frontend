// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  createUser,
  verifyEmail,
  verifyNewDevice,
  getUser,
  getUserILiked,
  getUsersWhoLikedMe,
  likeUser,
  getAllUser,
  fetchMatches,
  getProfileView
} from "../../Redux/Slices/Thunks/userThunks";
import {
  UserData,
  LikeUserResponse,
  UserPublicProfile,
  Match,
  profileView,
  LikeItem,
} from "../../component/AppTypes/User";

interface UserState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userILiked: LikeItem[] | null;
  getUsersWhoLikedMe: LikeItem[] | null;
  LikeResponse: LikeUserResponse | null;
  getEveryUsers:UserPublicProfile |null
  matches:Match[]|null
  viewers:profileView[]|null
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  userILiked: null,
  getUsersWhoLikedMe: null,
  LikeResponse: null,
  getEveryUsers: null,
  matches:null,
  viewers:null

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.user = action.payload;
          state.loading = false;
        }
      )
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // Verify email lifecycle
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Verification failed";
      })

      .addCase(verifyNewDevice.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyNewDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyNewDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Verification failed";
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get user";
      })
      // get user liked
      .addCase(getUserILiked.fulfilled, (state, action) => {
        state.userILiked = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserILiked.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserILiked.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get useriliked";
      })

      .addCase(getUsersWhoLikedMe.fulfilled, (state, action) => {
        state.getUsersWhoLikedMe = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUsersWhoLikedMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersWhoLikedMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get useriliked";
      })

      .addCase(likeUser.fulfilled, (state, action) => {
        state.LikeResponse = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(likeUser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(likeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get useriliked";
      })

      .addCase(getAllUser.fulfilled, (state, action) => {
        state.getEveryUsers = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get get all users    ";
      })

      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.matches = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get get all users    ";
      })

      .addCase(getProfileView.fulfilled, (state, action) => {
        state.viewers = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProfileView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to get get all viwers    ";
      });


      
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
