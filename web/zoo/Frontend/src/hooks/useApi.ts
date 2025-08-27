import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, homeService, postService, noticeService, adminService } from '../lib/services';
import type { LoginRequest, SignupRequest, CreatePostRequest, CreateNoticeRequest } from '../lib/types';

// Query keys
export const queryKeys = {
  home: ['home'],
  posts: ['posts'],
  post: (id: number) => ['posts', id],
  notices: ['notices'],
  notice: (id: number) => ['notices', id],
  profile: ['profile'],
  adminFlag: ['admin', 'flag'],
};

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: authService.getProfile,
    retry: false,
  });
};

// Home hook
export const useHome = () => {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: homeService.getHomePage,
    retry: false,
  });
};

// Post hooks
export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: postService.getAllPosts,
  });
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => postService.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostRequest) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePostRequest }) => 
      postService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

// Notice hooks
export const useNotices = () => {
  return useQuery({
    queryKey: queryKeys.notices,
    queryFn: noticeService.getAllNotices,
  });
};

export const useNotice = (id: number) => {
  return useQuery({
    queryKey: queryKeys.notice(id),
    queryFn: () => noticeService.getNotice(id),
    enabled: !!id,
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateNoticeRequest) => noticeService.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateNoticeRequest }) => 
      noticeService.updateNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => noticeService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
};

// Admin hooks
export const useAdminFlag = () => {
  return useQuery({
    queryKey: queryKeys.adminFlag,
    queryFn: adminService.getFlag,
    retry: false,
  });
};
