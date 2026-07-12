import React, { useState, useEffect } from 'react';
import { 
  Wrench, Fuel, DollarSign, BarChart3, Bell, ShieldCheck, Plus, CheckCircle, 
  Download, Calendar, AlertTriangle, User, RefreshCw, TrendingUp, Info
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Vehicle } from '../../types';

// ============================================================================
// 1. MAINTENANCE MODULE
// ============================================================================
export const MaintenancePage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    issue: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintRes, vehiclesRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles')
      ]);
      setRecords(maintRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/maintenance', formData);
      setIsModalOpen(false);
      setFormData({ vehicleId: '', issue: '', cost: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to log maintenance request');
    }
  };

  const handleCompleteService = async (id: string) => {
    try {
      await api.put(`/maintenance/${id}/complete`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to complete maintenance service');
    }
  };

  const getVehicleReg = (id: string) => {
    return vehicles.find(v => v.id === id)?.registrationNumber || `Veh-${id}`;
  };

  const getVehicleModel = (id: string) => {
    return vehicles.find(v => v.id === id)?.model || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Center</h1>
          <p className="text-gray-600 mt-1">Schedule and monitor vehicle repairs and health</p>
        </div>
        <Button onClick={() => { setError(''); setIsModalOpen(true); }} size="lg">
          <Plus size={20} /> Schedule Maintenance
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Loading maintenance dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Maintenance Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench size={18} className="text-amber-500" /> Active Repairs (In Shop)
              </h2>
              {records.filter(r => r.status === 'in_progress').length === 0 ? (
                <div className="py-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                  No vehicles currently in the shop. All assets active!
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {records.filter(r => r.status === 'in_progress').map(record => (
                    <div key={record.id} className="py-4 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#0066ff]">{getVehicleReg(record.vehicleId)}</span>
                          <span className="text-sm text-gray-500">({getVehicleModel(record.vehicleId)})</span>
                          <Badge variant="warning">In Shop</Badge>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">{record.issue}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {record.date}</span>
                          <span className="flex items-center gap-1"><DollarSign size={12} /> Cost: ${record.cost}</span>
                        </div>
                      </div>
                      <Button onClick={() => handleCompleteService(record.id)} variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                        <CheckCircle size={14} /> Mark Completed
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historical Maintenance Log */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Completed Service Log</h2>
              </div>
              <Table
                data={records.filter(r => r.status === 'completed')}
                columns={[
                  {
                    key: 'vehicleId',
                    label: 'Vehicle',
                    width: '20%',
                    render: (val) => getVehicleReg(val)
                  },
                  {
                    key: 'issue',
                    label: 'Issue / Action Taken',
                    width: '40%'
                  },
                  {
                    key: 'date',
                    label: 'Completion Date',
                    width: '20%'
                  },
                  {
                    key: 'cost',
                    label: 'Repair Cost',
                    width: '20%',
                    render: (val) => `$${val.toLocaleString()}`
                  }
                ]}
              />
            </div>
          </div>

          {/* Maintenance Summary Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Preventive Timeline</h2>
            <div className="relative border-l border-gray-200 pl-4 space-y-6 text-sm">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 bg-blue-100 text-blue-600 rounded-full p-1"><Info size={12} /></span>
                <p className="font-semibold text-gray-900">5,000 km Service Check</p>
                <p className="text-xs text-gray-500 mt-0.5">Applies to Vans and Bikes</p>
                <p className="text-xs text-gray-600 mt-1">Check fluids, change engine oil, perform tire rotation.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 bg-amber-100 text-amber-600 rounded-full p-1"><Wrench size={12} /></span>
                <p className="font-semibold text-gray-900">10,000 km Brake Safety Check</p>
                <p className="text-xs text-gray-500 mt-0.5">Applies to Volvo Trucks</p>
                <p className="text-xs text-gray-600 mt-1">Detailed evaluation of disc wear, ABS responsiveness, lines check.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 bg-green-100 text-green-600 rounded-full p-1"><TrendingUp size={12} /></span>
                <p className="font-semibold text-gray-900">Annual Emissions Inspection</p>
                <p className="text-xs text-gray-500 mt-0.5">Required for entire active fleet</p>
                <p className="text-xs text-gray-600 mt-1">Must renew carbon tax certificates by end of third quarter.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Maintenance Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Vehicle Service" size="md">
        <form onSubmit={handleCreateRequest} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Fleet Vehicle</label>
            <select
              required
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white text-sm"
            >
              <option value="">Choose a Vehicle</option>
              {vehicles.filter(v => v.status !== 'retired').map(v => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} - {v.model} ({v.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <input
              type="text"
              required
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              placeholder="e.g. Brake pad wear, transmission noise, routine 10k oil change"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="Cost in USD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" className="flex-1">Schedule & Send to Shop</Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 2. FUEL & EXPENSE MODULE
// ============================================================================
export const FuelExpensePage = () => {
  const [activeTab, setActiveTab] = useState<'fuel' | 'expenses'>('fuel');
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [fuelForm, setFuelForm] = useState({
    vehicleId: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [expenseForm, setExpenseForm] = useState({
    vehicleId: '',
    type: 'toll',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fuelRes, expenseRes, vehiclesRes] = await Promise.all([
        api.get('/fuel'),
        api.get('/expenses'),
        api.get('/vehicles')
      ]);
      setFuelLogs(fuelRes.data);
      setExpenses(expenseRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load cost logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/fuel', fuelForm);
      setIsFuelModalOpen(false);
      setFuelForm({ vehicleId: '', liters: '', cost: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to log fuel refill');
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/expenses', expenseForm);
      setIsExpenseModalOpen(false);
      setExpenseForm({ vehicleId: '', type: 'toll', cost: '', date: new Date().toISOString().split('T')[0], description: '' });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to log general expense');
    }
  };

  const getVehicleReg = (id: string) => {
    return vehicles.find(v => v.id === id)?.registrationNumber || `Veh-${id}`;
  };

  // KPI Calculations
  const totalFuelCost = fuelLogs.reduce((sum, item) => sum + Number(item.cost), 0);
  const totalExpenseCost = expenses.reduce((sum, item) => sum + Number(item.cost), 0);
  const totalLiters = fuelLogs.reduce((sum, item) => sum + Number(item.liters), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuel & Expenses</h1>
          <p className="text-gray-600 mt-1">Track fleet consumption, refills, tolls, and maintenance expenditures</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setError(''); setIsFuelModalOpen(true); }} variant="outline">
            <Fuel size={18} /> Refuel Log
          </Button>
          <Button onClick={() => { setError(''); setIsExpenseModalOpen(true); }}>
            <DollarSign size={18} /> Log Other Expense
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Loading expense registry...
        </div>
      ) : (
        <>
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Fuel Spending</p>
                <p className="text-2xl font-bold text-gray-900">${totalFuelCost.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Consumed: {totalLiters.toLocaleString()} L</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600"><Fuel size={24} /></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Operational Expenditures</p>
                <p className="text-2xl font-bold text-gray-900">${totalExpenseCost.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Tolls, Parts & Refuels combined</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600"><DollarSign size={24} /></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cost-per-km (Averaged)</p>
                <p className="text-2xl font-bold text-gray-900">$0.34</p>
                <p className="text-xs text-gray-500">Excluding acquisition costs</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600"><TrendingUp size={24} /></div>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('fuel')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'fuel' 
                  ? 'border-[#0066ff] text-[#0066ff]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Fuel Consumption Log
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'expenses' 
                  ? 'border-[#0066ff] text-[#0066ff]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              General Expense Ledgers
            </button>
          </div>

          {/* Tables */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {activeTab === 'fuel' ? (
              <Table
                data={fuelLogs}
                columns={[
                  {
                    key: 'date',
                    label: 'Refill Date',
                    width: '20%'
                  },
                  {
                    key: 'vehicleId',
                    label: 'Vehicle',
                    width: '30%',
                    render: (val) => getVehicleReg(val)
                  },
                  {
                    key: 'liters',
                    label: 'Volume (L)',
                    width: '25%',
                    render: (val) => `${val.toLocaleString()} Liters`
                  },
                  {
                    key: 'cost',
                    label: 'Refill Cost ($)',
                    width: '25%',
                    render: (val) => `$${val.toLocaleString()}`
                  }
                ]}
              />
            ) : (
              <Table
                data={expenses}
                columns={[
                  {
                    key: 'date',
                    label: 'Billing Date',
                    width: '15%'
                  },
                  {
                    key: 'vehicleId',
                    label: 'Vehicle',
                    width: '20%',
                    render: (val) => getVehicleReg(val)
                  },
                  {
                    key: 'type',
                    label: 'Category',
                    width: '15%',
                    render: (val) => (
                      <Badge variant={val === 'fuel' ? 'success' : val === 'maintenance' ? 'warning' : 'default'}>
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                      </Badge>
                    )
                  },
                  {
                    key: 'description',
                    label: 'Description',
                    width: '35%'
                  },
                  {
                    key: 'cost',
                    label: 'Amount ($)',
                    width: '15%',
                    render: (val) => `$${val.toLocaleString()}`
                  }
                ]}
              />
            )}
          </div>
        </>
      )}

      {/* Log Fuel Modal */}
      <Modal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} title="Log Vehicle Fuel Refill" size="md">
        <form onSubmit={handleFuelSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Refueled Vehicle</label>
            <select
              required
              value={fuelForm.vehicleId}
              onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white text-sm"
            >
              <option value="">Choose a Vehicle</option>
              {vehicles.filter(v => v.status !== 'retired').map(v => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} - {v.model}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Liters (L)</label>
              <input
                type="number"
                required
                min="1"
                value={fuelForm.liters}
                onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
                placeholder="Volume refilled"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost ($)</label>
              <input
                type="number"
                required
                min="1"
                value={fuelForm.cost}
                onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })}
                placeholder="Cost in USD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={fuelForm.date}
              onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" className="flex-1">Record Refuel</Button>
            <Button type="button" variant="outline" onClick={() => setIsFuelModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Log Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Log General Fleet Expense" size="md">
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                required
                value={expenseForm.vehicleId}
                onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white text-sm"
              >
                <option value="">Choose a Vehicle</option>
                {vehicles.filter(v => v.status !== 'retired').map(v => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
              <select
                value={expenseForm.type}
                onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white text-sm"
              >
                <option value="toll">Highway Toll</option>
                <option value="parking">Parking</option>
                <option value="repair">Minor Repair</option>
                <option value="other">Other Incidentals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expense Amount ($)</label>
              <input
                type="number"
                required
                min="1"
                value={expenseForm.cost}
                onChange={(e) => setExpenseForm({ ...expenseForm, cost: e.target.value })}
                placeholder="Amount in USD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Date</label>
              <input
                type="date"
                required
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense Description</label>
            <input
              type="text"
              required
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              placeholder="e.g. NH4 toll ticket payment, emergency punctures"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-sm"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" className="flex-1">Record Expense</Button>
            <Button type="button" variant="outline" onClick={() => setIsExpenseModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 3. REPORTS & ANALYTICS MODULE
// ============================================================================
export const ReportsPage = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/summary');
      setReportData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load report analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!reportData || !reportData.vehicleStats) return;
    
    // Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Registration Number,Model,Distance Traveled (km),Trips Run,Fuel Liters Consumed,Fuel Cost ($),Maintenance Cost ($),Total Costs ($),Revenue Earned ($),Net ROI (%)\n";
    
    // Rows
    reportData.vehicleStats.forEach((v: any) => {
      const roiPercent = (v.roi * 100).toFixed(2);
      const row = `"${v.registrationNumber}","${v.model}",${v.distanceTraveled},${v.tripsCount},${v.fuelConsumedLiters},${v.fuelCost},${v.maintenanceCost},${v.totalCost},${v.revenue},${roiPercent}%\n`;
      csvContent += row;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TransFlow_Fleet_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pie chart mapping
  const vehicleStats = reportData?.vehicleStats || [];
  
  return (
    <div className="space-y-6 print:p-8 print:bg-white">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Review operational audits, efficiency quotients, and financial ROI sheets</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <RefreshCw size={18} /> Print Audit
          </Button>
          <Button onClick={handleExportCSV}>
            <Download size={18} /> Export Performance CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Compiling charts and reports...
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trips Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Total Trips Completed (6 Months)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.charts.monthlyTrips}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="trips" fill="#0066ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fuel & Maintenance cost trend */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Expense Analysis Trends ($)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.charts.fuelExpenseTrend.map((fuelItem: any, idx: number) => ({
                    name: fuelItem.name,
                    Fuel: fuelItem.amount,
                    Maintenance: reportData.charts.maintenanceTrend[idx]?.amount || 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Fuel" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Maintenance" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Performance ROI Grid */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Performance & ROI Audit</h2>
            </div>
            <Table
              data={vehicleStats}
              columns={[
                {
                  key: 'registrationNumber',
                  label: 'Registration',
                  width: '12%',
                  render: (val, row) => (
                    <div>
                      <p className="font-semibold text-gray-900">{val}</p>
                      <p className="text-xs text-gray-500">{row.model}</p>
                    </div>
                  )
                },
                {
                  key: 'distanceTraveled',
                  label: 'Distance (km)',
                  width: '12%',
                  render: (val) => `${val.toLocaleString()} km`
                },
                {
                  key: 'fuelEfficiency',
                  label: 'Efficiency (km/L)',
                  width: '15%',
                  render: (val) => val > 0 ? `${val} km/L` : 'N/A'
                },
                {
                  key: 'totalCost',
                  label: 'Operational Cost ($)',
                  width: '15%',
                  render: (val) => `$${val.toLocaleString()}`
                },
                {
                  key: 'revenue',
                  label: 'Revenue ($)',
                  width: '15%',
                  render: (val) => `$${val.toLocaleString()}`
                },
                {
                  key: 'roi',
                  label: 'Vehicle ROI',
                  width: '15%',
                  render: (val) => {
                    const percent = (val * 100).toFixed(2);
                    const isPositive = val >= 0;
                    return (
                      <Badge variant={isPositive ? 'success' : 'danger'}>
                        {isPositive ? `+${percent}%` : `${percent}%`}
                      </Badge>
                    );
                  }
                }
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// 4. NOTIFICATIONS MODULE
// ============================================================================
export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      // Update state local
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  // Filter based on user role to show target/relevant alerts
  const userNotifs = notifications.filter(n => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return n.role === user.role;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Check critical alert logs, license warnings, and fleet service updates</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Loading alerts...
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {userNotifs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No new alerts or notifications. You are all set!
            </div>
          ) : (
            userNotifs.map(n => (
              <div 
                key={n.id} 
                className={`p-5 flex items-start gap-4 transition-all ${
                  n.read ? 'bg-white opacity-60' : 'bg-blue-50/40 hover:bg-blue-50/60'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  n.role === 'safety_officer' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {n.role === 'safety_officer' ? <AlertTriangle size={18} /> : <Wrench size={18} />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm text-gray-900 ${!n.read ? 'font-semibold' : ''}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString('en-IN')}</p>
                </div>
                {!n.read && (
                  <button 
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-xs text-[#0066ff] hover:text-[#0052cc] hover:underline font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. PLATFORM SETTINGS MODULE
// ============================================================================
export const SettingsPage = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure profile and operations limits</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck size={20} className="text-green-500" /> User Profile Information
        </h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500">Name</p>
            <p className="font-semibold text-gray-900 mt-1">{user?.name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500">Email Address</p>
            <p className="font-semibold text-gray-900 mt-1">{user?.email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500">Privilege Role</p>
            <Badge variant="info" className="mt-1">
              {user?.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500">Department</p>
            <p className="font-semibold text-gray-900 mt-1">{user?.department}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Operational System Parameters</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Audit Notification Trigger Threshold</span>
            <span className="font-bold text-gray-900">30 Days Expiry</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Safety Flag Action Score</span>
            <span className="font-bold text-red-600">&lt; 50% Safety Quotient</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Default Currency Unit</span>
            <span className="font-bold text-gray-900">USD ($)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
