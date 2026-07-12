import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001d3d] to-[#00315c]">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};
