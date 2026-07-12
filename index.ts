import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, BarChart3, MapPin, Wrench, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066ff] to-[#003d82] rounded-lg flex items-center justify-center text-white font-bold">
              TF
            </div>
            <span className="font-bold text-xl">TransFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-[#0066ff] text-white rounded-lg text-sm font-medium hover:bg-[#0052cc] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Transport Operations Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage vehicles, drivers, trips and expenses from one powerful platform. Replace Excel with a professional fleet management system.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-[#0066ff] text-white rounded-lg font-medium hover:bg-[#0052cc] transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Modern Logistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: 'Vehicle Management',
                description: 'Track and manage your entire fleet in real-time',
              },
              {
                icon: MapPin,
                title: 'Trip Dispatching',
                description: 'Efficient trip creation and driver assignment',
              },
              {
                icon: Wrench,
                title: 'Maintenance Tracking',
                description: 'Never miss a maintenance schedule',
              },
              {
                icon: BarChart3,
                title: 'Analytics & Reports',
                description: 'Data-driven insights for better decisions',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#0066ff] transition-colors"
                >
                  <Icon className="text-[#0066ff] mb-4" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Register', description: 'Create your account in minutes' },
              { step: '2', title: 'Setup', description: 'Add your vehicles and drivers' },
              { step: '3', title: 'Manage', description: 'Dispatch trips and track everything' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#0066ff] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001d3d] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2024 TransFlow. Smart Transport Operations Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};
