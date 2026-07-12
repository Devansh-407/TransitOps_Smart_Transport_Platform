import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Vehicle } from '../../types';
import api from '../../services/api';

const statusBadges: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  available: 'success',
  on_trip: 'info',
  in_shop: 'warning',
  retired: 'danger',
};

export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    type: 'truck' as const,
    capacity: 0,
    mileage: 0,
    acquisitionCost: 0,
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((v) =>
    v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setFormData({ registrationNumber: '', model: '', type: 'truck', capacity: 0, mileage: 0, acquisitionCost: 0 });
    setError('');
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      type: vehicle.type,
      capacity: vehicle.capacity,
      mileage: vehicle.mileage,
      acquisitionCost: (vehicle as any).acquisitionCost || 0,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveVehicle = async () => {
    try {
      setError('');
      if (selectedVehicle) {
        const response = await api.put(`/vehicles/${selectedVehicle.id}`, formData);
        setVehicles(vehicles.map((v) => (v.id === selectedVehicle.id ? response.data : v)));
      } else {
        const response = await api.post('/vehicles', formData);
        setVehicles([...vehicles, response.data]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      setError('');
      await api.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter((v) => v.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete vehicle');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your fleet vehicles</p>
        </div>
        <Button onClick={handleAddVehicle} size="lg">
          <Plus size={20} />
          Add Vehicle
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by registration or model..."
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
          Loading vehicles...
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table
            data={filteredVehicles}
            columns={[
              {
                key: 'registrationNumber',
                label: 'Registration',
                width: '15%',
              },
              {
                key: 'model',
                label: 'Model',
                width: '20%',
              },
              {
                key: 'type',
                label: 'Type',
                width: '12%',
                render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
              },
              {
                key: 'capacity',
                label: 'Capacity (kg)',
                width: '12%',
                render: (value) => value.toLocaleString(),
              },
              {
                key: 'mileage',
                label: 'Mileage (km)',
                width: '12%',
                render: (value) => value.toLocaleString(),
              },
              {
                key: 'status',
                label: 'Status',
                width: '12%',
                render: (value) => (
                  <Badge variant={statusBadges[value]}>
                    {value.replace('_', ' ').charAt(0).toUpperCase() + value.slice(1)}
                  </Badge>
                ),
              },
              {
                key: 'id',
                label: 'Actions',
                width: '15%',
                render: (value, item) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditVehicle(item)}
                      className="p-1 text-gray-500 hover:text-gray-900"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(value)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
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
        title={selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveVehicle();
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
              Registration Number
            </label>
            <input
              type="text"
              required
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'truck' | 'van' | 'bike' | 'taxi',
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            >
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="bike">Bike</option>
              <option value="taxi">Taxi</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (kg)
              </label>
              <input
                type="number"
                required
                value={formData.capacity || ''}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Odometer (km)
              </label>
              <input
                type="number"
                required
                value={formData.mileage || ''}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                required
                value={formData.acquisitionCost || ''}
                onChange={(e) =>
                  setFormData({ ...formData, acquisitionCost: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {selectedVehicle ? 'Update Vehicle' : 'Add Vehicle'}
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
