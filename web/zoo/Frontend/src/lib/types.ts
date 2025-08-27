export interface User {
  username: string;
  role: string;
  authenticated: boolean;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface HomePageData {
  message: string;
  posts: Post[];
  notices: Notice[];
  user: User;
}

export interface PostsResponse {
  count: number;
  posts: Post[];
}

export interface NoticesResponse {
  count: number;
  notices: Notice[];
}

export interface AuthResponse {
  message: string;
  token?: string;
  role?: string;
  username?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface ProfileResponse {
  message: string;
  username: string;
  role: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ApiError {
  error: string;
  your_role?: string;
  required_role?: string;
  hint?: string;
}

export interface AdminFlagResponse {
  flag: string;
  message: string;
  user: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ApiError {
  error: string;
  your_role?: string;
  required_role?: string;
  hint?: string;
}

export interface AdminFlagResponse {
  flag: string;
  message: string;
  user: string;
}
