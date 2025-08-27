import { useState } from 'react';
import { Shield, Flag, Users, Eye, Settings, AlertTriangle, Crown } from 'lucide-react';
import { useAdminFlag } from '../hooks/useApi';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: flagData, isLoading: flagLoading, error: flagError } = useAdminFlag();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'flag', label: 'CTF Flag', icon: Flag },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-700">Total Users</p>
                    <p className="text-2xl font-bold text-primary-900">42</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-500 rounded-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-success-700">Active Sessions</p>
                    <p className="text-2xl font-bold text-success-900">23</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning-500 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warning-700">Security Alerts</p>
                    <p className="text-2xl font-bold text-warning-900">7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { time: '2 minutes ago', event: 'New user registered: hacker123', type: 'info' },
                  { time: '15 minutes ago', event: 'Admin flag accessed successfully', type: 'warning' },
                  { time: '1 hour ago', event: 'Multiple failed login attempts detected', type: 'danger' },
                  { time: '2 hours ago', event: 'New post created: CTF Tips and Tricks', type: 'success' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'danger' ? 'bg-danger-500' :
                      activity.type === 'warning' ? 'bg-warning-500' :
                      activity.type === 'success' ? 'bg-success-500' : 'bg-info-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.event}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'flag':
        return (
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="text-center">
                <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-purple-900 mb-2 font-comic">
                  🏆 CTF Flag Access
                </h3>
                <p className="text-purple-700">
                  Congratulations! You have admin access to retrieve the flag.
                </p>
              </div>
            </div>

            <div className="card">
              {flagLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading flag...</p>
                </div>
              ) : flagError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
                  <p className="text-danger-700 font-medium">Failed to load flag</p>
                  <p className="text-gray-600 text-sm mt-2">
                    {(flagError as any)?.response?.data?.error || 'Unknown error occurred'}
                  </p>
                </div>
              ) : flagData ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-3">🚩 Flag Retrieved!</h4>
                    <div className="bg-green-100 border border-green-300 rounded p-4 font-mono text-green-800 break-all">
                      {flagData.flag}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Message:</h5>
                    <p className="text-blue-800">{flagData.message}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">User Information:</h5>
                    <p className="text-gray-700">Accessed by: {flagData.user}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No flag data available</p>
                </div>
              )}
            </div>

            <div className="card bg-yellow-50 border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">🎯 CTF Challenge Complete!</h4>
                  <p className="text-sm text-yellow-800">
                    You successfully found an admin access vulnerability. In a real application, 
                    proper authorization checks would prevent unauthorized access to sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { username: 'admin', role: 'admin', status: 'active', lastActive: '2 min ago' },
                      { username: 'moderator', role: 'moderator', status: 'active', lastActive: '15 min ago' },
                      { username: 'user1', role: 'user', status: 'active', lastActive: '1 hour ago' },
                      { username: 'hacker123', role: 'user', status: 'inactive', lastActive: '2 days ago' },
                    ].map((user, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin' ? 'bg-danger-100 text-danger-800' :
                            user.role === 'moderator' ? 'bg-warning-100 text-warning-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">⚠️ Security Vulnerabilities</h3>
                  <div className="space-y-3 text-sm text-red-800">
                    <div className="bg-red-100 border border-red-300 rounded p-3">
                      <h4 className="font-medium mb-1">JWT Verification Disabled</h4>
                      <p>JWT tokens are decoded without signature verification (intentional CTF vulnerability)</p>
                    </div>
                    <div className="bg-red-100 border border-red-300 rounded p-3">
                      <h4 className="font-medium mb-1">Path Traversal Possible</h4>
                      <p>File access endpoints may be vulnerable to directory traversal attacks</p>
                    </div>
                    <div className="bg-red-100 border border-red-300 rounded p-3">
                      <h4 className="font-medium mb-1">Weak Access Controls</h4>
                      <p>Some endpoints may not properly validate user permissions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Monitoring</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Failed Login Attempts</h4>
                  <p className="text-2xl font-bold text-danger-600">24</p>
                  <p className="text-sm text-gray-600">Last 24 hours</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Suspicious Activity</h4>
                  <p className="text-2xl font-bold text-warning-600">7</p>
                  <p className="text-sm text-gray-600">Active alerts</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Debug Mode</h4>
                    <p className="text-sm text-gray-600">Enable detailed error messages</p>
                  </div>
                  <div className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm">
                    Enabled
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">CTF Mode</h4>
                    <p className="text-sm text-gray-600">Intentional vulnerabilities for learning</p>
                  </div>
                  <div className="bg-warning-100 text-warning-800 px-3 py-1 rounded-full text-sm">
                    Active
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Registration</h4>
                    <p className="text-sm text-gray-600">Allow new user signups</p>
                  </div>
                  <div className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm">
                    Open
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-comic">Admin Panel 👑</h1>
          <p className="text-gray-600">System administration and CTF management</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
