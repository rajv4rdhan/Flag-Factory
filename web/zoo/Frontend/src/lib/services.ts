import { api, apiEndpoints } from './api';
import type { 
  HomePageData, 
  Post, 
  Notice, 
  AuthResponse, 
  LoginRequest, 
  SignupRequest, 
  ProfileResponse,
  PostsResponse,
  NoticesResponse,
  CreatePostRequest, 
  CreateNoticeRequest,
  AdminFlagResponse
} from './types';

// Auth services
export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post(apiEndpoints.login, data);
    return response.data;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await api.post(apiEndpoints.signup, data);
    return response.data;
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get(apiEndpoints.profile);
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Home service
export const homeService = {
  async getHomePage(): Promise<HomePageData> {
    const response = await api.get(apiEndpoints.home);
    return response.data;
  }
};

// Post services
export const postService = {
  async getAllPosts(): Promise<PostsResponse> {
    const response = await api.get(apiEndpoints.posts);
    return response.data;
  },

  async getPost(id: number): Promise<Post> {
    const response = await api.get(`${apiEndpoints.posts}/${id}`);
    return response.data;
  },

  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await api.post(apiEndpoints.posts, data);
    return response.data;
  },

  async updatePost(id: number, data: CreatePostRequest): Promise<Post> {
    const response = await api.put(`${apiEndpoints.posts}/${id}`, data);
    return response.data;
  },

  async deletePost(id: number): Promise<void> {
    await api.delete(`${apiEndpoints.posts}/${id}`);
  }
};

// Notice services
export const noticeService = {
  async getAllNotices(): Promise<NoticesResponse> {
    const response = await api.get(apiEndpoints.notices);
    return response.data;
  },

  async getNotice(id: number): Promise<Notice> {
    const response = await api.get(`${apiEndpoints.notices}/${id}`);
    return response.data;
  },

  async createNotice(data: CreateNoticeRequest): Promise<Notice> {
    const response = await api.post(apiEndpoints.adminNotices, data);
    return response.data;
  },

  async updateNotice(id: number, data: CreateNoticeRequest): Promise<Notice> {
    const response = await api.put(`${apiEndpoints.adminNotices}/${id}`, data);
    return response.data;
  },

  async deleteNotice(id: number): Promise<void> {
    await api.delete(`${apiEndpoints.adminNotices}/${id}`);
  }
};

// Admin services
export const adminService = {
  async getFlag(): Promise<AdminFlagResponse> {
    const response = await api.get(apiEndpoints.adminFlag);
    return response.data;
  }
};
