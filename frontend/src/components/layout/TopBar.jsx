import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb or page title could go here */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-neutral-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 relative">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7v5H9v6H4V7h11z" />
            </svg>
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-2">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;