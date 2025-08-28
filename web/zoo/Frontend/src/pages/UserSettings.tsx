import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserSettings } from '../lib/api';
import { User, Settings, Key, Shield, Eye, EyeOff } from 'lucide-react';

interface UserSettingsData {
  username: string;
  role: string;
  password: string;
  message: string;
}

const UserSettings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { data, isLoading, error } = useQuery<UserSettingsData>({
    queryKey: ['userSettings'],
    queryFn: getUserSettings,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600">Failed to load user settings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">User Settings</h1>
        </div>

        {data && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{data.message}</p>
            </div>

            {/* User Information */}
            <div className="grid gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-lg text-gray-900">{data.username}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    data.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : data.role === 'moderator'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Key className="h-5 w-5 text-gray-600 mr-3" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg text-gray-900 font-mono">
                      {showPassword ? data.password : '•'.repeat(data.password.length)}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
