import { useState } from 'react';
import { Plus, Filter, Search, Calendar, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/useApi';
import { formatDate } from '../utils/dateUtils';

const PostsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, my-posts
  const { data: posts, isLoading, error } = usePosts();

  const filteredPosts = posts?.posts?.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'my-posts') {
      // For now, we don't have user info, so show all posts
      return matchesSearch;
    }
    
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 font-comic">Posts 📝</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-danger-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load posts</h2>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 font-comic">Posts 📝</h1>
        <Link to="/posts/create" className="btn btn-primary group">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="input pl-10 pr-8 appearance-none"
            >
              <option value="all">All Posts</option>
              <option value="my-posts">My Posts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h2>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a post!'}
          </p>
          <Link to="/posts/create" className="btn btn-primary group">
            <Plus className="w-4 h-4 mr-2" />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post: any) => (
            <div key={post.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 font-comic">
                  {post.title}
                </h2>
                <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  Post
                </span>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {post.content.length > 200 
                  ? `${post.content.substring(0, 200)}...` 
                  : post.content
                }
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>By {post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
                
                <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium">
                  <Eye className="w-4 h-4" />
                  <span>Read More</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination would go here if needed */}
      {filteredPosts.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-600">
            Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
