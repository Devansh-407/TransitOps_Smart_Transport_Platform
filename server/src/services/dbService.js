import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'db.json');

// Helper to get fresh default database structure
const getInitialData = () => {
  return {
    users: [
      {
        id: 'admin-1',
        name: 'Asha Rao',
        email: 'admin@transflow.com',
        passwordHash: '$2a$10$QOa6NnK5vB/0b09P5K5eCeW8wE/uS4M3vP2j2eE5H.yB1fNf1Nf1y', // bcrypt for 'demo123'
        role: 'admin',
        department: 'Operations',
        avatar: 'AR'
      },
      {
        id: 'fleet-1',
        name: 'Ravi Menon',
        email: 'fleet@transflow.com',
        passwordHash: '$2a$10$QOa6NnK5vB/0b09P5K5eCeW8wE/uS4M3vP2j2eE5H.yB1fNf1Nf1y',
        role: 'fleet_manager',
        department: 'Fleet Ops',
        avatar: 'RM'
      },
      {
        id: 'driver-1',
        name: 'Neha Singh',
        email: 'driver@transflow.com',
        passwordHash: '$2a$10$QOa6NnK5vB/0b09P5K5eCeW8wE/uS4M3vP2j2eE5H.yB1fNf1Nf1y',
        role: 'driver',
        department: 'Field Delivery',
        avatar: 'NS'
      },
      {
        id: 'safety-1',
        name: 'Karan Iyer',
        email: 'safety@transflow.com',
        passwordHash: '$2a$10$QOa6NnK5vB/0b09P5K5eCeW8wE/uS4M3vP2j2eE5H.yB1fNf1Nf1y',
        role: 'safety_officer',
        department: 'Safety',
        avatar: 'KI'
      },
      {
        id: 'finance-1',
        name: 'Lina Thomas',
        email: 'finance@transflow.com',
        passwordHash: '$2a$10$QOa6NnK5vB/0b09P5K5eCeW8wE/uS4M3vP2j2eE5H.yB1fNf1Nf1y',
        role: 'financial_analyst',
        department: 'Finance',
        avatar: 'LT'
      }
    ],
    vehicles: [
      {
        id: '1',
        registrationNumber: 'TRK-001',
        model: 'Volvo FH16',
        type: 'truck',
        capacity: 20000,
        status: 'available',
        mileage: 45200,
        acquisitionCost: 120000,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        registrationNumber: 'VAN-045',
        model: 'Ford Transit',
        type: 'van',
        capacity: 3500,
        status: 'on_trip',
        mileage: 32100,
        acquisitionCost: 45000,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        registrationNumber: 'BIKE-102',
        model: 'Royal Enfield',
        type: 'bike',
        capacity: 150,
        status: 'available',
        mileage: 12500,
        acquisitionCost: 3000,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        registrationNumber: 'TAXI-088',
        model: 'Toyota Innova',
        type: 'taxi',
        capacity: 1200,
        status: 'in_shop',
        mileage: 67800,
        acquisitionCost: 25000,
        createdAt: new Date().toISOString()
      }
    ],
    drivers: [
      {
        id: 'driver-1',
        name: 'Neha Singh',
        licenseNumber: 'DL-12345',
        licenseCategory: 'HGV',
        licenseExpiryDate: '2028-12-31',
        phone: '9876543210',
        safetyScore: 95,
        status: 'on_trip'
      },
      {
        id: 'driver-2',
        name: 'Alex Kumar',
        licenseNumber: 'DL-67890',
        licenseCategory: 'LMV',
        licenseExpiryDate: '2027-05-15',
        phone: '9876543211',
        safetyScore: 88,
        status: 'available'
      },
      {
        id: 'driver-3',
        name: 'Vikram Dev',
        licenseNumber: 'DL-55443',
        licenseCategory: 'HGV',
        licenseExpiryDate: '2026-02-10', // Expired
        phone: '9876543212',
        safetyScore: 78,
        status: 'off_duty'
      },
      {
        id: 'driver-4',
        name: 'Suresh Pal',
        licenseNumber: 'DL-99887',
        licenseCategory: 'LMV',
        licenseExpiryDate: '2026-11-20',
        phone: '9876543213',
        safetyScore: 45,
        status: 'suspended'
      }
    ],
    trips: [
      {
        id: 'trip-1',
        source: 'Mumbai',
        destination: 'Pune',
        vehicleId: '2',
        driverId: 'driver-1',
        cargoWeight: 3000,
        distance: 150,
        status: 'dispatched',
        startDate: new Date().toISOString(),
        endDate: null,
        finalOdometer: null,
        fuelConsumed: null,
        revenue: 800,
        createdAt: new Date().toISOString()
      },
      {
        id: 'trip-2',
        source: 'Chennai',
        destination: 'Bangalore',
        vehicleId: '1',
        driverId: 'driver-2',
        cargoWeight: 15000,
        distance: 350,
        status: 'completed',
        startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 4).toISOString(),
        finalOdometer: 45200,
        fuelConsumed: 110,
        revenue: 2500,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'trip-3',
        source: 'Delhi',
        destination: 'Jaipur',
        vehicleId: '3',
        driverId: 'driver-4',
        cargoWeight: 100,
        distance: 270,
        status: 'cancelled',
        startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        finalOdometer: null,
        fuelConsumed: null,
        revenue: 0,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    maintenance: [
      {
        id: 'maint-1',
        vehicleId: '4',
        issue: 'Engine Tune-up & Oil Change',
        cost: 450,
        date: '2026-07-10',
        status: 'in_progress'
      },
      {
        id: 'maint-2',
        vehicleId: '1',
        issue: 'Brake Pad Replacement',
        cost: 1200,
        date: '2026-06-25',
        status: 'completed'
      }
    ],
    fuelLogs: [
      {
        id: 'fuel-1',
        vehicleId: '1',
        liters: 110,
        cost: 180,
        date: '2026-07-06'
      },
      {
        id: 'fuel-2',
        vehicleId: '2',
        liters: 45,
        cost: 75,
        date: '2026-07-11'
      }
    ],
    expenses: [
      {
        id: 'exp-1',
        vehicleId: '1',
        type: 'toll',
        cost: 50,
        date: '2026-07-05',
        description: 'NH4 Highway Toll'
      },
      {
        id: 'exp-2',
        vehicleId: '4',
        type: 'maintenance',
        cost: 450,
        date: '2026-07-10',
        description: 'Engine Tune-up (linked to maintenance log maint-1)'
      },
      {
        id: 'exp-3',
        vehicleId: '1',
        type: 'fuel',
        cost: 180,
        date: '2026-07-06',
        description: 'Refuel log fuel-1'
      },
      {
        id: 'exp-4',
        vehicleId: '2',
        type: 'fuel',
        cost: 75,
        date: '2026-07-11',
        description: 'Refuel log fuel-2'
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        role: 'safety_officer',
        message: "Driver Vikram Dev's license expired on 2026-02-10!",
        date: new Date().toISOString(),
        read: false
      },
      {
        id: 'notif-2',
        role: 'fleet_manager',
        message: 'Vehicle TAXI-088 has entered shop for Maintenance.',
        date: new Date().toISOString(),
        read: false
      }
    ]
  };
};

export const getDb = () => {
  if (!fs.existsSync(dbPath)) {
    const initialData = getInitialData();
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse db.json, generating default:', error);
    const initialData = getInitialData();
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
};

export const saveDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

export const getCollection = (collectionName) => {
  const db = getDb();
  return db[collectionName] || [];
};

export const saveCollection = (collectionName, items) => {
  const db = getDb();
  db[collectionName] = items;
  saveDb(db);
};

export const getItemById = (collectionName, id) => {
  const items = getCollection(collectionName);
  return items.find(item => item.id === id) || null;
};

import mongoose from 'mongoose';

// Schemas
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String },
  avatar: { type: String }
}, { timestamps: true });

const vehicleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  mileage: { type: Number, required: true },
  status: { type: String, required: true }
}, { timestamps: true });

const driverSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  phone: { type: String },
  licenseExpiry: { type: String, required: true },
  safetyScore: { type: Number, default: 100 },
  status: { type: String, required: true }
}, { timestamps: true });

const tripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  vehicleId: { type: String, required: true },
  driverId: { type: String, required: true },
  cargoWeight: { type: Number, required: true },
  distance: { type: Number, required: true },
  revenue: { type: Number, default: 0 },
  status: { type: String, required: true },
  startTime: { type: Date },
  endTime: { type: Date }
}, { timestamps: true });

const maintenanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  issue: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  type: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const fuelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  liters: { type: Number, required: true },
  cost: { type: Number, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  role: { type: String },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const models = {};
export let isMongoConnected = false;

export const initMongo = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('\n⚠ MONGODB_URI not set. Running on local JSON file database.');
    return;
  }

  try {
    models.users = mongoose.models.User || mongoose.model('User', userSchema);
    models.vehicles = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
    models.drivers = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
    models.trips = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
    models.maintenance = mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);
    models.expenses = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
    models.fuel = mongoose.models.Fuel || mongoose.model('Fuel', fuelSchema);
    models.notifications = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

    mongoose.set('strictQuery', false);
    await mongoose.connect(uri);
    isMongoConnected = true;
    console.log('\n✓ Connected to MongoDB Atlas! Syncing operational data...');
    await syncFromMongo();
  } catch (err) {
    console.error('✗ MongoDB Atlas connection failed:', err.message);
    console.log('⚠ Falling back to local JSON file database.');
  }
};

const syncFromMongo = async () => {
  try {
    const localDb = getDb();
    const collections = ['users', 'vehicles', 'drivers', 'trips', 'maintenance', 'expenses', 'fuel', 'notifications'];

    for (const name of collections) {
      const Model = models[name];
      const mongoItems = await Model.find({}).lean();

      if (mongoItems.length === 0 && localDb[name] && localDb[name].length > 0) {
        console.log(`Seeding MongoDB Atlas collection: ${name} (${localDb[name].length} records)...`);
        await Model.insertMany(localDb[name]);
      } else {
        localDb[name] = mongoItems.map(item => {
          const { _id, __v, ...rest } = item;
          return rest;
        });
      }
    }

    saveDb(localDb);
    console.log('✓ Database synchronized with MongoDB Atlas cloud records.');
  } catch (err) {
    console.error('✗ Database synchronization failed:', err.message);
  }
};

export const insertItem = (collectionName, item) => {
  const items = getCollection(collectionName);
  const newItem = {
    id: item.id || `${collectionName.slice(0, 3)}-${Math.random().toString(36).substr(2, 9)}`,
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  };
  items.push(newItem);
  saveCollection(collectionName, items);

  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      Model.create(newItem).catch(err => console.error(`Error syncing insert to Mongo: ${err.message}`));
    }
  }

  return newItem;
};

export const updateItemById = (collectionName, id, updates) => {
  const items = getCollection(collectionName);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  saveCollection(collectionName, items);

  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      Model.updateOne({ id }, items[index]).catch(err => console.error(`Error syncing update to Mongo: ${err.message}`));
    }
  }

  return items[index];
};

export const deleteItemById = (collectionName, id) => {
  const items = getCollection(collectionName);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  saveCollection(collectionName, items);

  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      Model.deleteOne({ id }).catch(err => console.error(`Error syncing delete to Mongo: ${err.message}`));
    }
  }

  return true;
};
