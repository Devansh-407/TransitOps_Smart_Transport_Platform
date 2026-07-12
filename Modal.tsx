import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION } from '../../constants/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(!isOpen);

  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle?.(newState);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`bg-gradient-to-b from-[#001d3d] to-[#00315c] text-white h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col border-r border-[#0052a3] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-[#0052a3] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center font-bold text-sm">
              TF
            </div>
            <span className="font-bold text-lg">TransFlow</span>
          </div>
        )}
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-[#0052a3] rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {MAIN_NAVIGATION.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                active
                  ? 'bg-[#0066ff] text-white'
                  : 'text-gray-300 hover:bg-[#0052a3]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-[#f59e0b] text-xs font-semibold text-black rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-[#0052a3] py-3 px-3">
        {SECONDARY_NAVIGATION.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                active
                  ? 'bg-[#0066ff] text-white'
                  : 'text-gray-300 hover:bg-[#0052a3]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
