import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0066ff] to-[#003d82] text-xl font-semibold text-white">
            {user?.avatar ?? 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{user?.name ?? 'User'}</h1>
            <p className="text-sm text-gray-600">{user?.email ?? 'No email available'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Account</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between"><span>Role</span><span className="font-medium text-gray-900">{user?.role?.replace(/_/g, ' ')}</span></div>
            <div className="flex justify-between"><span>Department</span><span className="font-medium text-gray-900">{user?.department}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-medium text-emerald-600">Active</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Quick Notes</h2>
          <p className="mt-4 text-sm text-gray-600">
            This profile view is now connected to the app state. In a real deployment, it would pull data from your backend and support editing profile details.
          </p>
        </div>
      </div>
    </div>
  );
};
