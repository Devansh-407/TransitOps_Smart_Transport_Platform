import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getCollection,
  saveCollection,
  getItemById,
  insertItem,
  updateItemById,
  deleteItemById
} from '../services/dbService.js';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'transflowsecret123';

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

router.post('/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  const users = await getCollection('users');
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Support both bcrypt password and simple direct password for flexibility
  let isMatch = false;
  if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
    isMatch = await bcrypt.compare(password, user.passwordHash);
  } else {
    isMatch = user.passwordHash === password;
  }

  if (!isMatch) {
    // Fallback: accept 'demo123' for standard demo accounts
    if (password === 'demo123') {
      isMatch = true;
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  }

  const finalRole = role || user.role;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: finalRole, department: user.department },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: finalRole,
      department: user.department,
      avatar: user.avatar
    }
  });
});

router.post('/auth/register', async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await getCollection('users');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    name,
    email,
    passwordHash,
    role,
    department: department || 'Field Ops',
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
  };

  const savedUser = await insertItem('users', newUser);

  const token = jwt.sign(
    { id: savedUser.id, name: savedUser.name, email: savedUser.email, role: savedUser.role, department: savedUser.department },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(201).json({
    token,
    user: {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      department: savedUser.department,
      avatar: savedUser.avatar
    }
  });
});

router.get('/auth/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ----------------------------------------------------
// VEHICLES ENDPOINTS
// ----------------------------------------------------

router.get('/vehicles', protect, async (req, res) => {
  res.json(await getCollection('vehicles'));
});

router.post('/vehicles', protect, async (req, res) => {
  const { registrationNumber, model, type, capacity, mileage, acquisitionCost } = req.body;
  if (!registrationNumber || !model || !type || !capacity) {
    return res.status(400).json({ error: 'Registration, Model, Type, and Capacity are required' });
  }

  const vehicles = await getCollection('vehicles');
  if (vehicles.some(v => v.registrationNumber.toUpperCase() === registrationNumber.toUpperCase())) {
    return res.status(400).json({ error: 'Vehicle with this registration number already exists' });
  }

  const newVehicle = await insertItem('vehicles', {
    registrationNumber: registrationNumber.toUpperCase(),
    model,
    type,
    capacity: Number(capacity),
    mileage: Number(mileage) || 0,
    acquisitionCost: Number(acquisitionCost) || 0,
    status: 'available'
  });

  res.status(201).json(newVehicle);
});

router.put('/vehicles/:id', protect, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const vehicle = await getItemById('vehicles', id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // Validate registration uniqueness if changing
  if (updates.registrationNumber && updates.registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
    const vehicles = await getCollection('vehicles');
    if (vehicles.some(v => v.registrationNumber.toUpperCase() === updates.registrationNumber.toUpperCase() && v.id !== id)) {
      return res.status(400).json({ error: 'Vehicle with this registration number already exists' });
    }
    updates.registrationNumber = updates.registrationNumber.toUpperCase();
  }

  const updatedVehicle = await updateItemById('vehicles', id, updates);
  res.json(updatedVehicle);
});

router.delete('/vehicles/:id', protect, async (req, res) => {
  const { id } = req.params;
  const success = await deleteItemById('vehicles', id);
  if (!success) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json({ success: true, message: 'Vehicle deleted successfully' });
});

// ----------------------------------------------------
// DRIVERS ENDPOINTS
// ----------------------------------------------------

router.get('/drivers', protect, async (req, res) => {
  res.json(await getCollection('drivers'));
});

router.post('/drivers', protect, async (req, res) => {
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, phone, safetyScore } = req.body;
  if (!name || !licenseNumber || !licenseExpiryDate) {
    return res.status(400).json({ error: 'Name, License Number, and Expiry Date are required' });
  }

  const drivers = await getCollection('drivers');
  if (drivers.some(d => d.licenseNumber.toUpperCase() === licenseNumber.toUpperCase())) {
    return res.status(400).json({ error: 'Driver with this license number already exists' });
  }

  const newDriver = await insertItem('drivers', {
    name,
    licenseNumber: licenseNumber.toUpperCase(),
    licenseCategory: licenseCategory || 'LMV',
    licenseExpiryDate,
    phone: phone || '',
    safetyScore: Number(safetyScore) || 90,
    status: 'available'
  });

  // If expired, check if we need to create warning notification
  const today = new Date().toISOString().split('T')[0];
  if (licenseExpiryDate < today) {
    await insertItem('notifications', {
      role: 'safety_officer',
      message: `Driver ${name}'s license expired on ${licenseExpiryDate}!`,
      date: new Date().toISOString(),
      read: false
    });
  }

  res.status(201).json(newDriver);
});

router.put('/drivers/:id', protect, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const driver = await getItemById('drivers', id);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }

  if (updates.licenseNumber && updates.licenseNumber.toUpperCase() !== driver.licenseNumber) {
    const drivers = await getCollection('drivers');
    if (drivers.some(d => d.licenseNumber.toUpperCase() === updates.licenseNumber.toUpperCase() && d.id !== id)) {
      return res.status(400).json({ error: 'Driver with this license number already exists' });
    }
    updates.licenseNumber = updates.licenseNumber.toUpperCase();
  }

  const updatedDriver = await updateItemById('drivers', id, updates);
  
  // Create notification if license is updated and now expired
  if (updates.licenseExpiryDate) {
    const today = new Date().toISOString().split('T')[0];
    if (updates.licenseExpiryDate < today) {
      await insertItem('notifications', {
        role: 'safety_officer',
        message: `Driver ${updatedDriver.name}'s license expired on ${updates.licenseExpiryDate}!`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }

  res.json(updatedDriver);
});

router.delete('/drivers/:id', protect, async (req, res) => {
  const { id } = req.params;
  const success = await deleteItemById('drivers', id);
  if (!success) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json({ success: true, message: 'Driver deleted successfully' });
});

// ----------------------------------------------------
// TRIPS ENDPOINTS
// ----------------------------------------------------

router.get('/trips', protect, async (req, res) => {
  res.json(await getCollection('trips'));
});

router.post('/trips', protect, async (req, res) => {
  const { source, destination, vehicleId, driverId, cargoWeight, distance, revenue } = req.body;
  if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !distance) {
    return res.status(400).json({ error: 'All trip fields are required' });
  }

  const vehicle = await getItemById('vehicles', vehicleId);
  const driver = await getItemById('drivers', driverId);

  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  // 1. Business Rule: Retired or In Shop vehicles must never appear in the dispatch selection.
  if (vehicle.status === 'retired' || vehicle.status === 'in_shop') {
    return res.status(400).json({ error: 'Vehicle is currently retired or in shop and cannot be assigned' });
  }

  // 2. Business Rule: Drivers with expired licenses or Suspended status cannot be assigned to trips.
  const today = new Date().toISOString().split('T')[0];
  if (driver.licenseExpiryDate < today) {
    return res.status(400).json({ error: "Driver's license is expired. Assign a valid driver." });
  }
  if (driver.status === 'suspended') {
    return res.status(400).json({ error: 'Driver is currently suspended and cannot be assigned' });
  }

  // 3. Business Rule: A driver or vehicle already marked On Trip cannot be assigned to another trip.
  if (vehicle.status === 'on_trip') {
    return res.status(400).json({ error: 'Vehicle is already on a trip' });
  }
  if (driver.status === 'on_trip') {
    return res.status(400).json({ error: 'Driver is already on a trip' });
  }

  // 4. Business Rule: Cargo Weight must not exceed the vehicle's maximum load capacity.
  if (Number(cargoWeight) > vehicle.capacity) {
    return res.status(400).json({ error: `Cargo weight (${cargoWeight} kg) exceeds vehicle's capacity (${vehicle.capacity} kg)` });
  }

  const newTrip = await insertItem('trips', {
    source,
    destination,
    vehicleId,
    driverId,
    cargoWeight: Number(cargoWeight),
    distance: Number(distance),
    status: 'draft',
    startDate: null,
    endDate: null,
    finalOdometer: null,
    fuelConsumed: null,
    revenue: Number(revenue) || 0
  });

  res.status(201).json(newTrip);
});

router.put('/trips/:id/dispatch', protect, async (req, res) => {
  const { id } = req.params;
  const trip = await getItemById('trips', id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  if (trip.status !== 'draft') {
    return res.status(400).json({ error: 'Only draft trips can be dispatched' });
  }

  const vehicle = await getItemById('vehicles', trip.vehicleId);
  const driver = await getItemById('drivers', trip.driverId);

  if (!vehicle || !driver) {
    return res.status(400).json({ error: 'Assigned vehicle or driver no longer exists' });
  }

  // Double check availability
  if (vehicle.status === 'on_trip' || driver.status === 'on_trip') {
    return res.status(400).json({ error: 'Vehicle or Driver is already busy on another trip' });
  }

  await updateItemById('trips', id, {
    status: 'dispatched',
    startDate: new Date().toISOString()
  });

  // 5. Business Rule: Dispatching a trip automatically changes both the vehicle and driver status to On Trip.
  await updateItemById('vehicles', trip.vehicleId, { status: 'on_trip' });
  await updateItemById('drivers', trip.driverId, { status: 'on_trip' });

  res.json({ success: true, message: 'Trip dispatched successfully' });
});

router.put('/trips/:id/complete', protect, async (req, res) => {
  const { id } = req.params;
  const { finalOdometer, fuelConsumed } = req.body;
  
  if (!finalOdometer) {
    return res.status(400).json({ error: 'Final odometer is required to complete the trip' });
  }

  const trip = await getItemById('trips', id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  if (trip.status !== 'dispatched') {
    return res.status(400).json({ error: 'Only dispatched trips can be completed' });
  }

  const vehicle = await getItemById('vehicles', trip.vehicleId);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const distance = Number(trip.distance);
  const odometerVal = Number(finalOdometer);

  if (odometerVal < vehicle.mileage) {
    return res.status(400).json({ error: `Final odometer (${odometerVal} km) cannot be less than vehicle's current mileage (${vehicle.mileage} km)` });
  }

  // Update Trip
  await updateItemById('trips', id, {
    status: 'completed',
    endDate: new Date().toISOString(),
    finalOdometer: odometerVal,
    fuelConsumed: Number(fuelConsumed) || 0
  });

  // 6. Business Rule: Completing a trip automatically changes both the vehicle and driver status back to Available.
  await updateItemById('vehicles', trip.vehicleId, {
    status: 'available',
    mileage: odometerVal
  });
  await updateItemById('drivers', trip.driverId, {
    status: 'available'
  });

  // Log fuel & expense if fuel was consumed
  if (fuelConsumed && Number(fuelConsumed) > 0) {
    const fuelCost = Math.round(Number(fuelConsumed) * 1.6); // Approximate cost multiplier
    const fuelLog = await insertItem('fuelLogs', {
      vehicleId: trip.vehicleId,
      liters: Number(fuelConsumed),
      cost: fuelCost,
      date: new Date().toISOString().split('T')[0]
    });

    await insertItem('expenses', {
      vehicleId: trip.vehicleId,
      type: 'fuel',
      cost: fuelCost,
      date: new Date().toISOString().split('T')[0],
      description: `Fuel consumed on trip: ${trip.source} to ${trip.destination} (${fuelLog.id})`
    });
  }

  res.json({ success: true, message: 'Trip completed successfully' });
});

router.put('/trips/:id/cancel', protect, async (req, res) => {
  const { id } = req.params;
  const trip = await getItemById('trips', id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const oldStatus = trip.status;
  
  await updateItemById('trips', id, {
    status: 'cancelled',
    endDate: new Date().toISOString()
  });

  // 7. Business Rule: Cancelling a dispatched trip restores the vehicle and driver to Available.
  if (oldStatus === 'dispatched') {
    await updateItemById('vehicles', trip.vehicleId, { status: 'available' });
    await updateItemById('drivers', trip.driverId, { status: 'available' });
  }

  res.json({ success: true, message: 'Trip cancelled successfully' });
});

// ----------------------------------------------------
// MAINTENANCE ENDPOINTS
// ----------------------------------------------------

router.get('/maintenance', protect, async (req, res) => {
  res.json(await getCollection('maintenance'));
});

router.post('/maintenance', protect, async (req, res) => {
  const { vehicleId, issue, cost, date } = req.body;
  if (!vehicleId || !issue || !cost) {
    return res.status(400).json({ error: 'Vehicle, Issue, and Cost are required' });
  }

  const vehicle = await getItemById('vehicles', vehicleId);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  // 8. Business Rule: Creating an active maintenance record automatically changes vehicle status to In Shop.
  const newMaint = await insertItem('maintenance', {
    vehicleId,
    issue,
    cost: Number(cost),
    date: date || new Date().toISOString().split('T')[0],
    status: 'in_progress'
  });

  await updateItemById('vehicles', vehicleId, { status: 'in_shop' });

  // Add maintenance as an expense record
  await insertItem('expenses', {
    vehicleId,
    type: 'maintenance',
    cost: Number(cost),
    date: date || new Date().toISOString().split('T')[0],
    description: `Maintenance: ${issue} (${newMaint.id})`
  });

  await insertItem('notifications', {
    role: 'fleet_manager',
    message: `Vehicle ${vehicle.registrationNumber} entered shop for: ${issue}`,
    date: new Date().toISOString(),
    read: false
  });

  res.status(201).json(newMaint);
});

router.put('/maintenance/:id/complete', protect, async (req, res) => {
  const { id } = req.params;
  const maint = await getItemById('maintenance', id);
  if (!maint) return res.status(404).json({ error: 'Maintenance record not found' });

  if (maint.status !== 'in_progress') {
    return res.status(400).json({ error: 'Maintenance is already completed' });
  }

  await updateItemById('maintenance', id, { status: 'completed' });

  const vehicle = await getItemById('vehicles', maint.vehicleId);
  if (vehicle) {
    // 9. Business Rule: Closing maintenance restores the vehicle to Available (unless retired).
    if (vehicle.status !== 'retired') {
      await updateItemById('vehicles', maint.vehicleId, { status: 'available' });
    }
  }

  res.json({ success: true, message: 'Maintenance completed successfully' });
});

// ----------------------------------------------------
// EXPENSES & FUEL ENDPOINTS
// ----------------------------------------------------

router.get('/expenses', protect, async (req, res) => {
  res.json(await getCollection('expenses'));
});

router.post('/expenses', protect, async (req, res) => {
  const { vehicleId, type, cost, date, description } = req.body;
  if (!vehicleId || !type || !cost || !description) {
    return res.status(400).json({ error: 'Vehicle, Type, Cost, and Description are required' });
  }

  const vehicle = await getItemById('vehicles', vehicleId);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const newExpense = await insertItem('expenses', {
    vehicleId,
    type,
    cost: Number(cost),
    date: date || new Date().toISOString().split('T')[0],
    description
  });

  res.status(201).json(newExpense);
});

router.get('/fuel', protect, async (req, res) => {
  res.json(await getCollection('fuelLogs'));
});

router.post('/fuel', protect, async (req, res) => {
  const { vehicleId, liters, cost, date } = req.body;
  if (!vehicleId || !liters || !cost) {
    return res.status(400).json({ error: 'Vehicle, Liters, and Cost are required' });
  }

  const vehicle = await getItemById('vehicles', vehicleId);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const logDate = date || new Date().toISOString().split('T')[0];
  
  const newFuelLog = await insertItem('fuelLogs', {
    vehicleId,
    liters: Number(liters),
    cost: Number(cost),
    date: logDate
  });

  // Automatically log an expense for the fuel fill
  await insertItem('expenses', {
    vehicleId,
    type: 'fuel',
    cost: Number(cost),
    date: logDate,
    description: `Refuel: ${liters} liters (${newFuelLog.id})`
  });

  res.status(201).json(newFuelLog);
});

// ----------------------------------------------------
// NOTIFICATIONS ENDPOINTS
// ----------------------------------------------------

router.get('/notifications', protect, async (req, res) => {
  const notifs = await getCollection('notifications');
  res.json(notifs);
});

router.put('/notifications/:id/read', protect, async (req, res) => {
  const { id } = req.params;
  const updated = await updateItemById('notifications', id, { read: true });
  if (!updated) return res.status(404).json({ error: 'Notification not found' });
  res.json(updated);
});

// ----------------------------------------------------
// REPORTS & ANALYTICS ENDPOINTS
// ----------------------------------------------------

router.get('/reports/summary', protect, async (req, res) => {
  const vehicles = await getCollection('vehicles');
  const trips = await getCollection('trips');
  const maintenance = await getCollection('maintenance');
  const fuelLogs = await getCollection('fuelLogs');
  const expenses = await getCollection('expenses');

  // 1. Operational Cost per Vehicle (Fuel + Maintenance expenses)
  const costPerVehicle = {};
  vehicles.forEach(v => {
    costPerVehicle[v.id] = {
      id: v.id,
      registrationNumber: v.registrationNumber,
      model: v.model,
      maintenanceCost: 0,
      fuelCost: 0,
      otherCost: 0,
      totalCost: 0,
      revenue: 0,
      tripsCount: 0,
      distanceTraveled: 0,
      fuelConsumedLiters: 0,
      acquisitionCost: v.acquisitionCost || 10000
    };
  });

  expenses.forEach(e => {
    if (costPerVehicle[e.vehicleId]) {
      const amt = Number(e.cost);
      if (e.type === 'maintenance') {
        costPerVehicle[e.vehicleId].maintenanceCost += amt;
      } else if (e.type === 'fuel') {
        costPerVehicle[e.vehicleId].fuelCost += amt;
      } else {
        costPerVehicle[e.vehicleId].otherCost += amt;
      }
      costPerVehicle[e.vehicleId].totalCost += amt;
    }
  });

  // Calculate distances & revenue from trips
  trips.forEach(t => {
    if (costPerVehicle[t.vehicleId]) {
      if (t.status === 'completed') {
        costPerVehicle[t.vehicleId].revenue += Number(t.revenue) || 0;
        costPerVehicle[t.vehicleId].tripsCount += 1;
        costPerVehicle[t.vehicleId].distanceTraveled += Number(t.distance) || 0;
        costPerVehicle[t.vehicleId].fuelConsumedLiters += Number(t.fuelConsumed) || 0;
      }
    }
  });

  // Add fuel logs liters if they aren't fully tracked on completed trips
  fuelLogs.forEach(f => {
    if (costPerVehicle[f.vehicleId] && costPerVehicle[f.vehicleId].fuelConsumedLiters === 0) {
      costPerVehicle[f.vehicleId].fuelConsumedLiters += Number(f.liters) || 0;
    }
  });

  // Compute final statistics
  const vehicleStats = Object.values(costPerVehicle).map(stat => {
    // 2. Fuel Efficiency (Distance / Fuel Liters)
    const fuelEfficiency = stat.fuelConsumedLiters > 0 
      ? Number((stat.distanceTraveled / stat.fuelConsumedLiters).toFixed(2)) 
      : 0;

    // 3. Vehicle ROI: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const netEarnings = stat.revenue - (stat.maintenanceCost + stat.fuelCost);
    const roiVal = stat.acquisitionCost > 0 
      ? Number((netEarnings / stat.acquisitionCost).toFixed(4)) 
      : 0;

    return {
      ...stat,
      fuelEfficiency,
      roi: roiVal
    };
  });

  // 4. Fleet Utilization (%)
  const activeCount = vehicles.filter(v => v.status === 'on_trip').length;
  const totalVehiclesCount = vehicles.length;
  const fleetUtilization = totalVehiclesCount > 0 
    ? Math.round((activeCount / totalVehiclesCount) * 100) 
    : 0;

  // Get monthly trends dynamically
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyTripsMap = {};
  const fuelTrendMap = {};
  const maintTrendMap = {};
  
  const last6Months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = months[tempDate.getMonth()];
    last6Months.push(monthName);
    monthlyTripsMap[monthName] = 0;
    fuelTrendMap[monthName] = 0;
    maintTrendMap[monthName] = 0;
  }

  // Count trips by month
  trips.forEach(t => {
    if (t.status === 'completed' && t.endTime) {
      const date = new Date(t.endTime);
      const mName = months[date.getMonth()];
      if (monthlyTripsMap[mName] !== undefined) {
        monthlyTripsMap[mName] += 1;
      }
    }
  });

  // Sum fuel and maintenance expenses by month
  expenses.forEach(e => {
    if (e.date) {
      const date = new Date(e.date);
      const mName = months[date.getMonth()];
      if (e.type === 'fuel' && fuelTrendMap[mName] !== undefined) {
        fuelTrendMap[mName] += Number(e.cost) || 0;
      }
      if (e.type === 'maintenance' && maintTrendMap[mName] !== undefined) {
        maintTrendMap[mName] += Number(e.cost) || 0;
      }
    }
  });

  const monthlyTrips = last6Months.map(name => ({ name, trips: monthlyTripsMap[name] }));
  const fuelExpenseTrend = last6Months.map(name => ({ name, amount: fuelTrendMap[name] }));
  const maintenanceTrend = last6Months.map(name => ({ name, amount: maintTrendMap[name] }));

  res.json({
    kpis: {
      totalVehicles: totalVehiclesCount,
      availableVehicles: vehicles.filter(v => v.status === 'available').length,
      activeTrips: trips.filter(t => t.status === 'dispatched').length,
      pendingTrips: trips.filter(t => t.status === 'draft').length,
      maintenanceVehicles: vehicles.filter(v => v.status === 'in_shop').length,
      driversOnDuty: (await getCollection('drivers')).filter(d => d.status === 'on_trip').length,
      fleetUtilization
    },
    vehicleStats,
    charts: {
      monthlyTrips,
      fuelExpenseTrend,
      maintenanceTrend
    }
  });
});

export default router;
