import { useState } from 'react';
import { Search, Filter, Bell, Calendar, User, AlertCircle, Info } from 'lucide-react';
import { useNotices } from '../hooks/useApi';
import { formatDate } from '../utils/dateUtils';

const NoticesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, important, info, success
  const { data: notices, isLoading, error } = useNotices();

  const getNoticeIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="w-5 h-5" />;
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNoticeStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      case 'high':
        return 'bg-warning-50 border-warning-200 text-warning-800';  
      case 'medium':
        return 'bg-info-50 border-info-200 text-info-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const filteredNotices = notices?.notices?.filter((notice: any) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && notice.priority === filterBy;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 font-comic">Notices 📢</h1>
        </div>
        <div className="grid gap-4">
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load notices</h2>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-comic">Notices 📢</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="text-sm">{filteredNotices.length} notices</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notices..."
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
              <option value="all">All Notices</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No notices found</h2>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No notices available at the moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice: any) => (
            <div key={notice.id} className={`card border-l-4 ${getNoticeStyles(notice.priority)}`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-0.5 ${getNoticeStyles(notice.priority)}`}>
                  {getNoticeIcon(notice.priority)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 font-comic">
                      {notice.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNoticeStyles(notice.priority)}`}>
                        {notice.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>By {notice.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(notice.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredNotices.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-600">
            Showing {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
