import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, ArrowLeft } from 'lucide-react';
import { useCreatePost } from '../hooks/useApi';

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await createPostMutation.mutateAsync(formData);
      navigate('/posts');
    } catch (error: any) {
      console.error('Failed to create post:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/posts')}
          className="btn btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </button>
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 font-comic">Create New Post 📝</h1>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter a catchy title for your post"
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Post Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="input resize-y"
              placeholder="Write your post content here. You can include text, links, and formatting..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.length} characters
            </p>
          </div>

          {createPostMutation.error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-danger-700 text-sm">
                  {(createPostMutation.error as any)?.response?.data?.error || 'Failed to create post'}
                </p>
              </div>
            </div>
          )}

          {createPostMutation.isSuccess && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-success-700 text-sm">
                  Post created successfully! Redirecting...
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={createPostMutation.isPending || !formData.title.trim() || !formData.content.trim()}
              className="btn btn-primary flex-1 sm:flex-none group"
            >
              {createPostMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="btn btn-secondary"
              disabled={createPostMutation.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      {(formData.title || formData.content) && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {formData.title && (
              <h4 className="text-xl font-semibold text-gray-900 mb-3 font-comic">
                {formData.title}
              </h4>
            )}
            {formData.content && (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {formData.content}
              </p>
            )}
            {!formData.title && !formData.content && (
              <p className="text-gray-500 italic">Start typing to see a preview...</p>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Writing Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Keep your title concise and descriptive</li>
          <li>• Use clear, engaging language in your content</li>
          <li>• Break up long paragraphs for better readability</li>
          <li>• Include relevant details that add value to readers</li>
          <li>• Proofread before posting to catch any errors</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePostPage;
