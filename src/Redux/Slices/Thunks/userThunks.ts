// redux/thunks/userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserData , Match,LikeUserResponse, UserPublicProfile, profileView, LikeItem} from '../../../component/AppTypes/User';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  userName: string;
  email: string;
  password: string;
}


interface VerifyEmailPayload {
    token: string; // usually verification token from email link
  }
  
  interface VerifyPayload {
    email: string;
    code: string;
  }
  
  interface VerifyResponse {
    user: {
      id: string;
      email: string;
      username: string;
    };
    token: string;
  }

  const API_URL =process.env.REACT_APP_BACKEND_URL;



  export const loginUser = createAsyncThunk<
  { user: UserData; token: string },
  LoginCredentials,
  { rejectValue: string }
>('user/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/loginuser`, credentials);
if(res){
    localStorage.setItem('token',res.data.token)
}
    return {
      user: res.data.user,
      token: res.data.token, // your backend must return this
    };
    
  } catch (err: any) {
    console.error("❌ AXIOS ERROR:", err); // full Axios error object
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

export const createUser = createAsyncThunk<
  UserData,
  RegisterData,
  { rejectValue: string }
>('user/create', async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/createuser`, userData);
    return res.data.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});


  export const verifyEmail = createAsyncThunk<
    { message: string }, // expected response
    VerifyEmailPayload,
    { rejectValue: string } 
    
  >('user/verifyEmail', async ({ token }, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/verifyemail/${token}`)
      return res.data;
    }  catch (err: any) {
        
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Verification failed');
      }
  });

  export const verifyNewDevice = createAsyncThunk<
  VerifyResponse,
  VerifyPayload,
  { rejectValue: string }
>('user/verifyNewDevice', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/confirm-login-code`, credentials); // adjust endpoint if needed
    if(res){
        localStorage.setItem('token',res.data.token)
    }
    return {
      user: res.data.user,
      token: res.data.token,
    };
    
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to verify device'
    );
  }
});

export const getUser = createAsyncThunk<
  UserData,             // ✅ returning a plain UserData object
  void,
  { rejectValue: string }
>('user/getUser', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');

    const res = await axios.get(`${API_URL}/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;  // ✅ return only the user object
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch user'
    );
  }
});

// users i liked 
export const getUserILiked = createAsyncThunk<
LikeItem[],           // return type
  void,             // no argument needed
  { rejectValue: string }
>(
  'likes/getuseriliked',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/get-users-i-liked`, {
       
        headers: {
          Authorization: `Bearer ${token}`,
        },
      
      });
      return res.data.likedUsers as LikeItem[]; // Adjust if your API returns differently
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch likes');
    }
  }
);


export const getUsersWhoLikedMe= createAsyncThunk<
LikeItem[],           // return type
  void,             // no argument needed
  { rejectValue: string }
>(
  'likes/getuserswholikedme',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
    
      const res = await axios.get(`${API_URL}/get-users-who-liked-me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return res.data.usersWhoLikedMe as LikeItem[]; // Adjust if your API returns differently
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch likes');
    }
  }
);



export const likeUser = createAsyncThunk<
  LikeUserResponse,         // Response type
  string,                   // likedUserId
  { rejectValue: string }   // Error message
>(
  'likes/likeUser',
  async (likedUserId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/like-user`, { likedUserId },{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      
      });
   
      return response.data;
    } catch (error: any) {
        console.log(error)

      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
      
    }
  }
);


// users match
export const fetchMatches = createAsyncThunk<
  Match[],           // return type
  void,              // no argument
  { rejectValue: string }
>(
  'matches/fetchMatches',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/get-all-matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data as Match[]; // Adjust according to API response shape
    } catch (err: any) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch matches');
      
    }
  }
);

// get all user
export const getAllUser = createAsyncThunk<
  UserPublicProfile,             // ✅ returning a plain UserData object
  void,
  { rejectValue: string }
>('user/getAllUser', async (_, thunkAPI) => {
  try {
    
    const res = await axios.get(`${API_URL}/get-all-users`, {
    });
    return res.data;  // ✅ return only the user object
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch user'
    );
  }
});


export const getProfileView = createAsyncThunk<
  profileView[],         // Response type: array of ProfileView
  string | undefined,    // userId param
  { rejectValue: string }
>(
  'likes/getProfileViewers',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!userId) {
        return rejectWithValue('User ID is required');
      }

      const response = await axios.get(`${API_URL}/get-viewers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data; // should be ProfileView[]
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

