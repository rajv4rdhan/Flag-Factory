import { Link } from 'react-router-dom';
import { FileText, Bell } from 'lucide-react';
import { useHome } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useHome();

  // If not authenticated, show a welcome screen without making API calls
  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <div className="text-6xl mb-8 floating-animation">🦓</div>
          <h1 className="text-6xl font-black mb-8 text-gray-900 font-inter tracking-tight">
            Welcome to Zoo
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The minimal platform for creative minds to share thoughts, discover insights, and build communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/login" className="btn btn-primary text-lg px-8 py-4 group">
              Enter the Platform
            </Link>
            <Link to="/signup" className="btn btn-outline text-lg px-8 py-4">
              Create Account
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card text-center hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Posts</h3>
            <p className="text-gray-600 leading-relaxed">Share knowledge and engage with our community of creators and innovators</p>
          </div>
          
          <div className="card text-center hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-6 bg-orange-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Notices</h3>
            <p className="text-gray-600 leading-relaxed">Stay ahead with exclusive announcements and insider updates from our platform</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="card max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Zoo! 🦓</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Connect with the community through posts and stay informed with notices.
          </p>
          <Link to="/posts" className="btn btn-primary text-lg px-8 py-4 group">
            Explore Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-black mb-8 text-gray-900 font-inter tracking-tight">
          Welcome to Zoo! 🦓
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {data?.message || 'Where innovation meets community'}
        </p>
        
        {data?.user?.username ? (
          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-700">
              Welcome back, <span className="font-bold text-gray-900">{data.user.username}</span>!
            </p>
            <span className={`badge text-lg px-6 py-3 ${
              data.user.role === 'admin' ? 'badge-admin' : 
              data.user.role === 'moderator' ? 'badge-moderator' : 
              'badge-user'
            }`}>
              {data.user.role}
            </span>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary text-lg px-8 py-4 group">
            Get Started
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link to="/posts" className="card hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-gray-900 rounded-xl shadow-sm">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-xl text-gray-900">Posts</h3>
              <p className="text-gray-600">Share your thoughts and ideas</p>
            </div>
          </div>
        </Link>

        <Link to="/notices" className="card hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-orange-600 rounded-xl shadow-sm">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-xl text-gray-900">Notices</h3>
              <p className="text-gray-600">Important announcements</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Notices */}
      {data?.notices && data.notices.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Recent Notices</h2>
          <div className="space-y-4">
            {data.notices.slice(0, 3).map((notice) => (
              <div key={notice.id} className={`card ${
                notice.priority === 'critical' ? 'notice-critical' : 
                notice.priority === 'high' ? 'notice-high' : 
                notice.priority === 'medium' ? 'notice-medium' : 'notice-low'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-bold text-xl">{notice.title}</h3>
                      <span className="text-sm opacity-75 uppercase tracking-wider font-mono px-2 py-1 bg-black/10 rounded">
                        {notice.priority}
                      </span>
                    </div>
                    <p className="opacity-90 mb-3 leading-relaxed">{notice.content}</p>
                    <div className="flex items-center space-x-4 text-sm opacity-75">
                      <span className="font-medium">By {notice.author}</span>
                      <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/notices" className="btn btn-outline px-6 py-3">
              View All Notices
            </Link>
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {data?.posts && data.posts.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">Recent Posts</h2>
            <Link to="/posts" className="btn btn-outline px-6 py-3">
              View All Posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.slice(0, 6).map((post) => (
              <div key={post.id} className="card hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">By {post.author}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
