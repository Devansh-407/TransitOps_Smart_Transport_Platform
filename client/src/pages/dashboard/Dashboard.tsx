import React from 'react';
import { Truck, CheckCircle, MapPin, Wrench, Users, Zap } from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyTripsData = [
  { month: 'Jan', trips: 120 },
  { month: 'Feb', trips: 145 },
  { month: 'Mar', trips: 132 },
  { month: 'Apr', trips: 165 },
  { month: 'May', trips: 178 },
  { month: 'Jun', trips: 189 },
];

const fuelExpenseData = [
  { week: 'Week 1', expense: 2400 },
  { week: 'Week 2', expense: 1398 },
  { week: 'Week 3', expense: 1800 },
  { week: 'Week 4', expense: 3908 },
];

const recentActivities = [
  {
    id: '1',
    title: 'Vehicle TRK-102 Dispatched',
    description: 'Assigned to driver Rahul on Route A',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Maintenance Completed',
    description: 'Vehicle VH-045 maintenance completed',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    title: 'Trip Completed',
    description: 'Driver Priya completed delivery to Zone 5',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    title: 'Driver License Expiry Alert',
    description: 'Driver Arjun license expiring in 15 days',
    timestamp: '1 day ago',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your fleet overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="Total Vehicles"
          value="42"
          icon={Truck}
          trend={{ value: 5, isPositive: true }}
          bgColor="bg-blue-50"
          iconColor="text-[#0066ff]"
        />
        <KPICard
          title="Available Vehicles"
          value="28"
          icon={CheckCircle}
          trend={{ value: 12, isPositive: false }}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <KPICard
          title="Active Trips"
          value="8"
          icon={MapPin}
          trend={{ value: 3, isPositive: true }}
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
        <KPICard
          title="Maintenance Required"
          value="5"
          icon={Wrench}
          trend={{ value: 2, isPositive: false }}
          bgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <KPICard
          title="Drivers On Duty"
          value="24"
          icon={Users}
          trend={{ value: 1, isPositive: true }}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Fleet Utilization"
          value="66%"
          icon={Zap}
          trend={{ value: 4, isPositive: true }}
          bgColor="bg-cyan-50"
          iconColor="text-cyan-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trips Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trips</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTripsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="trips" 
                stroke="#0066ff" 
                strokeWidth={2}
                dot={{ fill: '#0066ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Expense Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Expense Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fuelExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar 
                dataKey="expense" 
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 gap-6">
        <ActivityFeed activities={recentActivities} />
      </div>
    </div>
  );
};
