export interface UserData {
    _id?: string;
    fullName?: string;
    userName?: string;
    email: string;
    phone?: string;
    gender?: 'male' | 'female';
    dateOfBirth?: string;
    institution?: string;
    department?: string;
    course?: string;
    level?: '100' | '200' | '300' | '400' | '500' | 'Graduate';
    bio?: string;
    profilePhoto?: string;
    photos?: string[];
    interests?: string[];
    lookingFor?: (
      | 'serious relationship'
      | 'casual dating'
      | 'friendship'
      | 'one night stand'
      | 'fling'
      | 'study buddy'
    )[];
    location?: {
      state?: string;
      city?: string;
    };
    verified?: boolean;
    emailVerified?: boolean;
    isSubscribed?: boolean;
    planType?: 'free' | 'basic';
    subscriptionPlan?: 'none' | 'daily' | 'weekly' | 'monthly';
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    hasCompletedOnboarding?:boolean;
    lastActive?: string;
    spinPoints?: number;
    withdrawRequest?: {
      amount?: number;
      status?: 'pending' | 'approved' | 'rejected';
      requestedAt?: string;
      processedAt?: string;
    };
    devices?: {
      ip?: string;
      userAgent?: string;
      lastLogin?: string;
    }[];
    isOnline?: boolean;
    socialMedia?: {
      name: string;
      link: string;
    }[];
    loginCode?: number;
    loginCodeExpiry?: string;
    userType?: 'student' | 'non-student';
    isGraduate?: boolean;
    graduateDetails?: {
      school?: string;
      course?: string;
      currentJob?: string;
    };
    spinRewards?: {
      prize: string;
      date?: string;
    }[];
    limits?: {
      dailyLikes?: number;
      dailyChatsStarted?: number;
      lastReset?: string;
    };
    graduateSchool?:string;
    graduateCourse?:string;
    currentJob?:string;
    username?:string;
    
    createdAt?: string;
  }
  
  export interface SlimUser {
    _id: string;
    userName: string;
    profilePhoto: string;
    gender: string;
    institution: string;
    dateOfBirth: string | Date;
}

export interface LikeItem{
  _id?:string;
  likedAt:string;
  likedUser:SlimUser
  liker?: SlimUser;
}



  
  
  export interface Match {
    _id?: string;
    matchedAt: Date |string  // Can be ID or populated object
    otherUser:   SlimUser;
    isActive:Boolean
  }
  
  type Viewer = {
    _id: string;
    userName: string;
    profilePhoto: string;
    gender: string;
    institution: string;
    dateOfBirth:string
  };
  
  export interface profileView {
    _id: string;
    viewed: string; // ID of the user being viewed
    viewedAt: string; // ISO date string
    viewer: Viewer
  }



  export interface LikeUserResponse {
    message: string;
    matched?: boolean;
  }
  
  export interface UserPublicProfile {
    _id: string;
    userName: string;
    profilePhoto: string;
    institution?: string;
    interests?: string[];
    lookingFor?: string;
    isSubscribed: boolean;
    isGraduate: boolean;
    isOnline: boolean;
    liked?: boolean;
    dateOfBirth:Date; // Local-only field for UI
  }
  export interface UserSummary {
    _id: string;
    userName: string;
    profilePhoto: string;
  }
  
  export interface MessageSummary {
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    _id: string;
  }
  
  export interface ConversationSummary {
    conversationId: string;
    otherUser: UserSummary;
    lastMessage: MessageSummary | null;
    updatedAt: string;
  }