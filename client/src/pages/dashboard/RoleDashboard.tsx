import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, ShieldCheck, TrendingUp, Truck, Users, Wrench, 
  Fuel, FileBarChart, DollarSign, Activity, AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [driverCountData, setDriverCountData] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, driversRes] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/drivers')
      ]);
      setData(summaryRes.data);
      setDriverCountData(driversRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Loading Command Center...
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalVehicles: 0,
    availableVehicles: 0,
    activeTrips: 0,
    pendingTrips: 0,
    maintenanceVehicles: 0,
    driversOnDuty: 0,
    fleetUtilization: 0
  };

  const vehicleStats = data?.vehicleStats || [];
  const totalFuelCost = vehicleStats.reduce((sum: number, s: any) => sum + s.fuelCost, 0);
  const totalMaintenanceCost = vehicleStats.reduce((sum: number, s: any) => sum + s.maintenanceCost, 0);
  const totalSpend = totalFuelCost + totalMaintenanceCost;

  // Calculate safety officer metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const expiredLicensesCount = driverCountData.filter((d: any) => (d.licenseExpiryDate || d.licenseExpiry) < todayStr).length;
  const suspendedDriversCount = driverCountData.filter((d: any) => d.status === 'suspended').length;
  const avgSafetyScore = driverCountData.length > 0
    ? Math.round(driverCountData.reduce((sum: number, d: any) => sum + d.safetyScore, 0) / driverCountData.length)
    : 100;

  // Dynamic content based on user role
  const getRoleDashboardConfig = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Command Center',
          subtitle: 'System-wide logistics oversight, resource telemetry, and compliance status.',
          metrics: [
            { label: 'Total Fleet Size', value: kpis.totalVehicles, subtext: 'Registered vehicles', icon: Truck, color: 'text-blue-600 bg-blue-50' },
            { label: 'Active Dispatched Trips', value: kpis.activeTrips, subtext: 'In transit now', icon: Activity, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Fleet Utilization', value: `${kpis.fleetUtilization}%`, subtext: 'Dispatched vs standby', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          ]
        };
      case 'fleet_manager':
        return {
          title: 'Fleet Operations Desktop',
          subtitle: 'Plan dispatches, track vehicle check-ins, and inspect maintenance schedules.',
          metrics: [
            { label: 'Vehicles Available', value: kpis.availableVehicles, subtext: 'Ready for routes', icon: Truck, color: 'text-green-600 bg-green-50' },
            { label: 'Active Deliveries', value: kpis.activeTrips, subtext: 'On-road assets', icon: Activity, color: 'text-blue-600 bg-blue-50' },
            { label: 'Vehicles In Shop', value: kpis.maintenanceVehicles, subtext: 'Undergoing repair', icon: Wrench, color: 'text-amber-600 bg-amber-50' },
          ]
        };
      case 'driver':
        return {
          title: 'Driver Workspace',
          subtitle: 'Access delivery logs, safety scores, and vehicle availability status.',
          metrics: [
            { label: 'Drivers On Duty', value: kpis.driversOnDuty, subtext: 'Active crew members', icon: Users, color: 'text-blue-600 bg-blue-50' },
            { label: 'Vehicles Available', value: kpis.availableVehicles, subtext: 'Standby assets', icon: Truck, color: 'text-green-600 bg-green-50' },
            { label: 'Active Shipments', value: kpis.activeTrips, subtext: 'Ongoing network dispatches', icon: Activity, color: 'text-indigo-600 bg-indigo-50' },
          ]
        };
      case 'safety_officer':
        return {
          title: 'Safety Oversight Panel',
          subtitle: 'Enforce driving compliance, track license validity, and evaluate safety indices.',
          metrics: [
            { label: 'Average Safety Index', value: `${avgSafetyScore}%`, subtext: 'Fleet crew average', icon: ShieldCheck, color: 'text-green-600 bg-green-50' },
            { label: 'Expired Driver Licenses', value: expiredLicensesCount, subtext: 'Requires resolution', icon: AlertCircle, color: expiredLicensesCount > 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50' },
            { label: 'Suspended Drivers', value: suspendedDriversCount, subtext: 'Dispatched block active', icon: Users, color: suspendedDriversCount > 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50' },
          ]
        };
      case 'financial_analyst':
        return {
          title: 'Financial Management Control',
          subtitle: 'Audit fleet expenditures, fuel refill trends, and cost efficiency indexes.',
          metrics: [
            { label: 'Total Fleet Spend', value: `$${totalSpend.toLocaleString()}`, subtext: 'Fuel + Maintenance', icon: DollarSign, color: 'text-blue-600 bg-blue-50' },
            { label: 'Fuel Invoices Total', value: `$${totalFuelCost.toLocaleString()}`, subtext: 'Refills logged', icon: Fuel, color: 'text-green-600 bg-green-50' },
            { label: 'Maintenance Cost', value: `$${totalMaintenanceCost.toLocaleString()}`, subtext: 'Repair spending', icon: Wrench, color: 'text-amber-600 bg-amber-50' },
          ]
        };
      default:
        return {
          title: 'TransFlow Command Center',
          subtitle: 'Centralized fleet operations management desk.',
          metrics: []
        };
    }
  };

  const config = getRoleDashboardConfig();

  const quickActions = [
    { label: 'Fleet Vehicles', icon: Truck, path: '/vehicles' },
    { label: 'Driver Crew', icon: Users, path: '/drivers' },
    { label: 'Dispatches', icon: Activity, path: '/trips' },
    { label: 'Maintenance Shop', icon: Wrench, path: '/maintenance' },
    { label: 'Expenses Ledgers', icon: DollarSign, path: '/fuel-expenses' },
    { label: 'Operations Reports', icon: FileBarChart, path: '/reports' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#001529] via-[#002d54] to-[#0066ff] p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
          <Truck size={240} />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-200 font-bold">TRANSFLOW CORE</p>
            <h1 className="text-2xl font-bold mt-0.5">{config.title}</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-blue-100/90 relative z-10 leading-relaxed">
          {config.subtitle}
        </p>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {config.metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-400 font-medium">{metric.subtext}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#0066ff]" /> Quick Navigation
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link 
                to={action.path}
                key={action.label} 
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 bg-gray-50 hover:bg-blue-50/20 text-center gap-2 text-gray-700 hover:text-[#0066ff] transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-lg bg-white border border-gray-200 group-hover:border-blue-300 transition-colors shadow-xs">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Role and Department Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-start gap-4">
        <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900">Security Credentials Verified</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Authenticated successfully as <span className="font-semibold text-gray-900">{user?.name}</span>. 
            You belong to the <strong className="text-gray-900">{user?.department}</strong> division and possess <strong className="text-[#0066ff] uppercase tracking-wider text-xs">{user?.role?.replace('_', ' ')}</strong> clearance credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
