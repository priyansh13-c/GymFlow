import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = user?.role === 'gym_owner' ? [
    { name: 'Dashboard', path: '/owner/dashboard', icon: '📊' },
    { name: 'Gym Setup', path: '/owner/gym-setup', icon: '🏢' },
    { name: 'Members', path: '/owner/members', icon: '👥' },
    { name: 'Trainers', path: '/owner/trainers', icon: '👨‍🏫' },
    { name: 'Notices', path: '/owner/notices', icon: '📢' },
    { name: 'Analytics', path: '/owner/analytics', icon: '📈' },
    { name: 'Profile', path: '/owner/profile', icon: '👤' },
  ] : [
    { name: 'Dashboard', path: '/member/dashboard', icon: '📊' },
    { name: 'Workouts', path: '/member/workouts', icon: '💪' },
    { name: 'Calories', path: '/member/calories', icon: '🍎' },
    { name: 'Trainers', path: '/member/trainers', icon: '👨‍🏫' },
    { name: 'Notices', path: '/member/notices', icon: '📢' },
    { name: 'Analytics', path: '/member/analytics', icon: '📈' },
    { name: 'Profile', path: '/member/profile', icon: '👤' },
  ];

  return (
    <div className={`bg-white border-r border-neutral-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary-600">GymFlow</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        >
          <svg
            className={`w-5 h-5 text-neutral-600 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {!isCollapsed && (
              <span className="font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-neutral-200 p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-neutral-500 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;