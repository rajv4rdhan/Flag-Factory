import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-96 flex items-center justify-center py-12">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Animation */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-gray-300 font-comic">404</div>
          <div className="text-8xl">🦓</div>
          <h1 className="text-3xl font-bold text-gray-900 font-comic">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 text-lg">
            Looks like this zebra wandered off the path! 
            The page you're looking for doesn't exist in our zoo.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/" className="btn btn-primary w-full group">
            <Home className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Search className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-medium text-blue-900 mb-2">Looking for something specific?</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <Link to="/posts" className="block hover:underline">📝 Browse Posts</Link>
                <Link to="/notices" className="block hover:underline">📢 Check Notices</Link>
                <Link to="/profile" className="block hover:underline">👤 View Profile</Link>
                <Link to="/login" className="block hover:underline">🔐 Sign In</Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTF Easter Egg */}
        <div className="card bg-purple-50 border-purple-200">
          <div className="text-sm text-purple-800">
            <p className="font-medium mb-1">🏆 CTF Tip</p>
            <p>
              Sometimes the most interesting discoveries happen when you wander off the beaten path. 
              Keep exploring! 🕵️‍♂️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
