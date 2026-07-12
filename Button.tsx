import React, { useState } from 'react';
import { Search, Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userName = 'User', userRole = 'Admin' }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleProfile = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="max-w-md flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ef4444]"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#0066ff] to-[#003d82] text-sm font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{userName}</div>
                <div className="text-xs text-gray-500">{userRole}</div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                <div className="border-b border-gray-200 p-4">
                  <div className="text-sm font-medium text-gray-900">{userName}</div>
                  <div className="text-xs text-gray-500">{userRole}</div>
                </div>
                <button
                  onClick={handleProfile}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 border-t border-gray-200 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
