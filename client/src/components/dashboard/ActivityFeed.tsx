import React from 'react';
import { Clock } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex-shrink-0 mt-1">
              <div className="w-2 h-2 bg-[#0066ff] rounded-full mt-2"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Clock size={12} />
                {activity.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
