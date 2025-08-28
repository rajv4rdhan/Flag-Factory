import { User, Shield } from 'lucide-react';
import { useProfile } from '../hooks/useApi';

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-danger-500 mb-4">
          <User className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profile</h2>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-comic">My Profile 👤</h1>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-comic">
                {profile?.username}
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{profile?.role || 'user'} Account</span>
              </div>
            </div>
          </div>

          {/* Profile Message */}
          {profile?.message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">{profile.message}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Username</p>
                <p className="text-gray-600">{profile?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Role</p>
                <p className="text-gray-600 capitalize">{profile?.role || 'user'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTF Info */}
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
        <h3 className="text-lg font-medium text-green-900 mb-2">🦁 Zoo Keeper's Secret</h3>
        <p className="text-sm text-green-800">
          "In the digital zoo, only the master keeper holds the golden key. 
          The animals whisper secrets, but only those with the highest authority 
          can unlock the cage where the precious flag roams free..."
        </p>
        <div className="mt-3 text-xs text-green-700">
          <p>🐨 <strong>Visitor:</strong> Can observe the animals from afar</p>
          <p>🦒 <strong>Zookeeper:</strong> Can feed and care for some animals</p>
          <p>🦁 <strong>Zoo Master:</strong> Commands all creatures and guards the sacred flag</p>
        </div>
        <div className="mt-2 text-xs text-green-600 italic">
          Hint: After all this, the key to the cage lies in the shadows.
        </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
