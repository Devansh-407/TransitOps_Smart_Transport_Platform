import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const demoAccounts = [
  { label: 'Admin', email: 'admin@transflow.com' },
  { label: 'Fleet Manager', email: 'fleet@transflow.com' },
  { label: 'Driver', email: 'driver@transflow.com' },
  { label: 'Safety Officer', email: 'safety@transflow.com' },
  { label: 'Financial Analyst', email: 'finance@transflow.com' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: 'admin@transflow.com',
    password: 'demo123',
    role: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const type = (e.target as any).type;
    const checked = (e.target as any).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(formData.email, formData.password, formData.role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use one of the demo accounts below.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066ff] to-[#003d82] font-bold text-white">
            TF
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mb-6 text-center text-gray-600">Sign in to your TransFlow account</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
              Override Dashboard Role (Optional)
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-800 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            >
              <option value="">Default (Registered Account Role)</option>
              <option value="admin">System Admin</option>
              <option value="fleet_manager">Fleet Manager</option>
              <option value="driver">Driver</option>
              <option value="safety_officer">Safety Officer</option>
              <option value="financial_analyst">Financial Analyst</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 focus:ring-[#0066ff]"
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-[#0066ff] hover:text-[#0052cc]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#0066ff] to-[#003d82] text-white font-medium py-2.5 hover:shadow-lg transition-all disabled:opacity-50 active:scale-98"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 leading-relaxed">
          <strong>Role-Based Access System:</strong> Your account role (selected during registration) determines your dashboard layout and system permissions. You do not need to re-select your role to sign in.
        </div>

        <details className="mt-4 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden text-sm">
          <summary className="px-4 py-2 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none">
            Need demo accounts? (Click to view)
          </summary>
          <div className="p-4 border-t border-gray-200 space-y-1 text-gray-600 bg-white">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, email: account.email, password: 'demo123' }))}
                className="block text-left text-[#0066ff] hover:text-[#0052cc] hover:underline"
              >
                {account.label}: {account.email}
              </button>
            ))}
            <p className="mt-2 text-xs text-gray-500">Password for all demo accounts: <strong>demo123</strong></p>
          </div>
        </details>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-[#0066ff] hover:text-[#0052cc]">
            Sign up here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
