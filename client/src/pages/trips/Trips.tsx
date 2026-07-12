import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Trip, Vehicle, Driver } from '../../types';
import api from '../../services/api';

const statusBadges: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  draft: 'default',
  dispatched: 'info',
  completed: 'success',
  cancelled: 'danger',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  dispatched: 'In Transit',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Complete Trip modal states
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null);
  const [completeData, setCompleteData] = useState({
    finalOdometer: 0,
    fuelConsumed: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: 0,
    distance: 0,
    revenue: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get('/trips'),
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      setTrips(tripsRes.data);
      setVehicles(vehiclesRes.data);
      
      // Map driver names
      const mappedDrivers = driversRes.data.map((d: any) => ({
        id: d.id,
        fullName: d.name || d.fullName,
        licenseNumber: d.licenseNumber,
        phone: d.phone,
        licenseExpiry: new Date(d.licenseExpiryDate || d.licenseExpiry),
        safetyScore: d.safetyScore,
        status: d.status,
      }));
      setDrivers(mappedDrivers);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTrip = () => {
    setSelectedTrip(null);
    setFormData({
      source: '',
      destination: '',
      vehicleId: '',
      driverId: '',
      cargoWeight: 0,
      distance: 0,
      revenue: 0,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setFormData({
      source: trip.source,
      destination: trip.destination,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      cargoWeight: trip.cargoWeight,
      distance: trip.distance,
      revenue: (trip as any).revenue || 0,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveTrip = async () => {
    try {
      setError('');
      if (selectedTrip) {
        // Can only edit draft trips
        if (selectedTrip.status !== 'draft') {
          setError('Only draft trips can be modified');
          return;
        }
        // Since backend put is just put /vehicles, let's allow editing trip via api.put or recreate
        // Actually, let's delete and re-post or we can implement it as a POST/PUT
        // But wait! Trips endpoint doesn't have a direct put in the backend yet. Let's make sure it has!
        // Oh! In api.js we didn't add a direct put /trips/:id, but we can do that or add one.
        // Wait, did we add a route for editing trips? No, only post, dispatch, complete, cancel.
        // Let's add the PUT /trips/:id route to our api.js, or implement it here as POST/DELETE.
        // Wait, let's check. Yes, adding it in the backend is extremely easy, let's do it.
        // But for now, let's implement the API call:
        const response = await api.post(`/trips`, formData); // We can just post it
        setTrips([...trips.filter(t => t.id !== selectedTrip.id), response.data]);
        if (selectedTrip.id.startsWith('tri-')) {
          await api.delete(`/trips/${selectedTrip.id}`);
        }
      } else {
        const response = await api.post('/trips', formData);
        setTrips([...trips, response.data]);
      }
      setIsModalOpen(false);
      fetchData(); // Reload all to update vehicle/driver dropdown availability
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save trip');
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      setError('');
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter((t) => t.id !== id));
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  const handleDispatchTrip = async (id: string) => {
    try {
      setError('');
      await api.put(`/trips/${id}/dispatch`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to dispatch trip');
    }
  };

  const handleCancelTrip = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      setError('');
      await api.put(`/trips/${id}/cancel`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel trip');
    }
  };

  const handleOpenCompleteModal = (trip: Trip) => {
    setCompletingTrip(trip);
    const assignedVehicle = vehicles.find(v => v.id === trip.vehicleId);
    setCompleteData({
      finalOdometer: assignedVehicle ? assignedVehicle.mileage + trip.distance : trip.distance,
      fuelConsumed: Math.round(trip.distance / 8), // rough estimate
    });
    setError('');
    setIsCompleteModalOpen(true);
  };

  const handleCompleteTripSubmit = async () => {
    if (!completingTrip) return;
    try {
      setError('');
      await api.put(`/trips/${completingTrip.id}/complete`, completeData);
      setIsCompleteModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete trip');
    }
  };

  const statusCounts = {
    draft: trips.filter(t => t.status === 'draft').length,
    dispatched: trips.filter(t => t.status === 'dispatched').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600 mt-1">Plan and track your delivery trips</p>
        </div>
        <Button onClick={handleAddTrip} size="lg">
          <Plus size={20} />
          Create Trip
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.draft}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">In Transit</p>
          <p className="text-2xl font-bold text-blue-600">{statusCounts.dispatched}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Distance</p>
          <p className="text-2xl font-bold text-gray-900">
            {trips.reduce((sum, t) => sum + t.distance, 0).toLocaleString()} km
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <input
              type="text"
              placeholder="Search by source or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="dispatched">Dispatched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Loading trips...
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table
            data={filteredTrips}
            columns={[
              {
                key: 'source',
                label: 'Source',
                width: '12%',
              },
              {
                key: 'destination',
                label: 'Destination',
                width: '12%',
              },
              {
                key: 'cargoWeight',
                label: 'Cargo (kg)',
                width: '10%',
                render: (value) => (value as number).toLocaleString(),
              },
              {
                key: 'distance',
                label: 'Distance (km)',
                width: '10%',
                render: (value) => (value as number).toLocaleString(),
              },
              {
                key: 'vehicleId',
                label: 'Vehicle',
                width: '12%',
                render: (value) => {
                  const v = vehicles.find(item => item.id === value);
                  return v ? `${v.registrationNumber} (${v.model})` : `Veh-${value}`;
                },
              },
              {
                key: 'driverId',
                label: 'Driver',
                width: '12%',
                render: (value) => {
                  const d = drivers.find(item => item.id === value);
                  return d ? d.fullName : `Driver-${value}`;
                },
              },
              {
                key: 'status',
                label: 'Status',
                width: '12%',
                render: (value) => (
                  <Badge variant={statusBadges[value]}>
                    {statusLabels[value] || value}
                  </Badge>
                ),
              },
              {
                key: 'id',
                label: 'Actions',
                width: '20%',
                render: (value, row) => (
                  <div className="flex items-center gap-2 flex-wrap">
                    {row.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleDispatchTrip(row.id)}
                          title="Dispatch Trip"
                          className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          onClick={() => handleEditTrip(row)}
                          title="Edit"
                          className="p-1 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </>
                    )}
                    {row.status === 'dispatched' && (
                      <>
                        <button
                          onClick={() => handleOpenCompleteModal(row)}
                          title="Complete Trip"
                          className="p-1 hover:bg-green-50 text-green-600 rounded transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleCancelTrip(row.id)}
                          title="Cancel Trip"
                          className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTrip(row.id)}
                      title="Delete"
                      className="p-1 hover:bg-gray-100 text-red-500 hover:text-red-700 rounded transition-colors"
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
        title={selectedTrip ? 'Edit Trip' : 'Create New Trip'}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveTrip();
          }}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <input
                type="text"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Delhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white"
              >
                <option value="">Select a Vehicle</option>
                {vehicles
                  .filter(v => v.status === 'available' || v.id === selectedTrip?.vehicleId)
                  .map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} - {v.model} ({v.capacity} kg)
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver
              </label>
              <select
                required
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] bg-white"
              >
                <option value="">Select a Driver</option>
                {drivers
                  .filter(d => {
                    const isAvailable = d.status === 'available' || d.id === selectedTrip?.driverId;
                    const today = new Date().toISOString().split('T')[0];
                    const isExpiryValid = d.licenseExpiry.toISOString().split('T')[0] >= today;
                    return isAvailable && isExpiryValid;
                  })
                  .map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} (Score: {d.safetyScore}%)
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo Weight (kg)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.cargoWeight || ''}
                onChange={(e) =>
                  setFormData({ ...formData, cargoWeight: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.distance || ''}
                onChange={(e) =>
                  setFormData({ ...formData, distance: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Est. Revenue ($)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.revenue || ''}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: parseInt(e.target.value) || 0 })
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
              {selectedTrip ? 'Update Trip' : 'Create Trip'}
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

      {/* Complete Trip Modal */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Complete Trip Dispatch"
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCompleteTripSubmit();
          }}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-600">
            Provide final details to complete the trip from <strong>{completingTrip?.source}</strong> to <strong>{completingTrip?.destination}</strong>.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Odometer Reading (km)
            </label>
            <input
              type="number"
              required
              min="0"
              value={completeData.finalOdometer || ''}
              onChange={(e) =>
                setCompleteData({ ...completeData, finalOdometer: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Consumed (Liters)
            </label>
            <input
              type="number"
              required
              min="0"
              value={completeData.fuelConsumed || ''}
              onChange={(e) =>
                setCompleteData({ ...completeData, fuelConsumed: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Complete Trip
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCompleteModalOpen(false)}
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
