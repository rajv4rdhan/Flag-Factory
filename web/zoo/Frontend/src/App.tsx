import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';

// Page imports (we'll create these next)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostsPage from './pages/PostsPage';
import NoticesPage from './pages/NoticesPage';
import ProfilePage from './pages/ProfilePage';
import UserSettings from './pages/UserSettings';
import AdminPage from './pages/AdminPage';
import CreatePostPage from './pages/CreatePostPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/posts/create" element={<CreatePostPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <UserSettings />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
