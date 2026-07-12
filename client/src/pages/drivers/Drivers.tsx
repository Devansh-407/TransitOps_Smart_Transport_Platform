import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Driver } from '../../types';
import api from '../../services/api';

const getLicenseExpiryDays = (expiry: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryCopy = new Date(expiry);
  expiryCopy.setHours(0, 0, 0, 0);
  const diffTime = expiryCopy.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getExpiryBadgeVariant = (days: number): 'success' | 'warning' | 'danger' => {
  if (days < 0) return 'danger';
  if (days < 30) return 'warning';
  return 'success';
};

const statusBadgeVariant = (status: string) => {
  if (status === 'available' || status === 'active') return 'success';
  if (status === 'on_trip') return 'info';
  if (status === 'off_duty') return 'warning';
  return 'danger'; // suspended
};

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    phone: '',
    licenseExpiry: '',
    licenseCategory: 'LMV',
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/drivers');
      // Map properties: the backend returns 'name' and 'licenseExpiryDate', map them to 'fullName' and 'licenseExpiry'
      const mappedDrivers = response.data.map((d: any) => ({
        id: d.id,
        fullName: d.name || d.fullName,
        licenseNumber: d.licenseNumber,
        phone: d.phone,
        licenseExpiry: new Date(d.licenseExpiryDate || d.licenseExpiry),
        safetyScore: d.safetyScore,
        status: d.status,
        createdAt: new Date(d.createdAt)
      }));
      setDrivers(mappedDrivers);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((d) =>
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setFormData({ fullName: '', licenseNumber: '', phone: '', licenseExpiry: '', licenseCategory: 'LMV' });
    setError('');
    setIsModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      fullName: driver.fullName,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
      licenseExpiry: driver.licenseExpiry.toISOString().split('T')[0],
      licenseCategory: (driver as any).licenseCategory || 'LMV',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveDriver = async () => {
    try {
      setError('');
      const payload = {
        name: formData.fullName,
        licenseNumber: formData.licenseNumber,
        licenseExpiryDate: formData.licenseExpiry,
        phone: formData.phone,
        licenseCategory: formData.licenseCategory,
      };

      if (selectedDriver) {
        const response = await api.put(`/drivers/${selectedDriver.id}`, payload);
        const updated = response.data;
        const mappedUpdated = {
          id: updated.id,
          fullName: updated.name || updated.fullName,
          licenseNumber: updated.licenseNumber,
          phone: updated.phone,
          licenseExpiry: new Date(updated.licenseExpiryDate || updated.licenseExpiry),
          safetyScore: updated.safetyScore,
          status: updated.status,
          createdAt: new Date(updated.createdAt)
        };
        setDrivers(drivers.map((d) => (d.id === selectedDriver.id ? mappedUpdated : d)));
      } else {
        const response = await api.post('/drivers', payload);
        const created = response.data;
        const mappedCreated = {
          id: created.id,
          fullName: created.name || created.fullName,
          licenseNumber: created.licenseNumber,
          phone: created.phone,
          licenseExpiry: new Date(created.licenseExpiryDate || created.licenseExpiry),
          safetyScore: created.safetyScore,
          status: created.status,
          createdAt: new Date(created.createdAt)
        };
        setDrivers([...drivers, mappedCreated]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save driver');
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      setError('');
      await api.delete(`/drivers/${id}`);
      setDrivers(drivers.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete driver');
    }
  };

  // Count expiring licenses
  const expiringLicenses = drivers.filter((d) => {
    const days = getLicenseExpiryDays(d.licenseExpiry);
    return days < 30 && days >= 0;
  }).length;

  const expiredLicenses = drivers.filter((d) => {
    const days = getLicenseExpiryDays(d.licenseExpiry);
    return days < 0;
  }).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600 mt-1">Manage your drivers and monitor license validity</p>
        </div>
        <Button onClick={handleAddDriver} size="lg">
          <Plus size={20} />
          Add Driver
        </Button>
      </div>

      {/* Alerts */}
      {(expiringLicenses > 0 || expiredLicenses > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {expiringLicenses > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-amber-900">{expiringLicenses} License(s) Expiring Soon</p>
                <p className="text-sm text-amber-700">Renew licenses within 30 days</p>
              </div>
            </div>
          )}
          {expiredLicenses > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-900">{expiredLicenses} License(s) Expired</p>
                <p className="text-sm text-red-700">Immediate action required</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Loading drivers...
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table
            data={filteredDrivers}
            columns={[
              {
                key: 'fullName',
                label: 'Name',
                width: '20%',
              },
              {
                key: 'licenseNumber',
                label: 'License Number',
                width: '15%',
              },
              {
                key: 'phone',
                label: 'Phone',
                width: '15%',
              },
              {
                key: 'licenseExpiry',
                label: 'License Expiry',
                width: '15%',
                render: (value) => {
                  const date = value as Date;
                  const days = getLicenseExpiryDays(date);
                  const badgeVariant = getExpiryBadgeVariant(days);
                  let label = '';
                  if (days < 0) {
                    label = `Expired ${Math.abs(days)} days ago`;
                  } else if (days === 0) {
                    label = 'Expires today';
                  } else {
                    label = `Expires in ${days} days`;
                  }
                  return (
                    <Badge variant={badgeVariant}>
                      {label}
                    </Badge>
                  );
                },
              },
              {
                key: 'safetyScore',
                label: 'Safety Score',
                width: '12%',
                render: (value) => {
                  const score = value as number;
                  const variant = score >= 90 ? 'success' : score >= 80 ? 'info' : 'warning';
                  return (
                    <Badge variant={variant}>
                      {score}%
                    </Badge>
                  );
                },
              },
              {
                key: 'status',
                label: 'Status',
                width: '10%',
                render: (value) => (
                  <Badge variant={statusBadgeVariant(value)}>
                    {value.replace('_', ' ').charAt(0).toUpperCase() + value.slice(1)}
                  </Badge>
                ),
              },
              {
                key: 'id',
                label: 'Actions',
                width: '13%',
                render: (_, row) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditDriver(row)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(row.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDriver ? 'Edit Driver' : 'Add New Driver'}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveDriver();
          }}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              required
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Category
              </label>
              <select
                value={formData.licenseCategory}
                onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white"
              >
                <option value="LMV">LMV (Light Motor Vehicle)</option>
                <option value="HGV">HGV (Heavy Goods Vehicle)</option>
                <option value="MCWG">MCWG (Motorcycle with Gear)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Expiry Date
            </label>
            <input
              type="date"
              required
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {selectedDriver ? 'Update Driver' : 'Add Driver'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
