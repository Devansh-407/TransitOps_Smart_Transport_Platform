import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 min-h-screen bg-gray-50">
        <Navbar userName={user?.name ?? 'User'} userRole={user?.role?.replace(/_/g, ' ') ?? 'Admin'} />

        <main className={`mt-16 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
