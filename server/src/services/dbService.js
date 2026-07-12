import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'db.json');

// Helper to get fresh default database structure
const getInitialData = () => {
  return {
    users: [],
    vehicles: [],
    drivers: [],
    trips: [],
    maintenance: [],
    expenses: [],
    fuel: [],
    notifications: []
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

export const getCollection = async (collectionName) => {
  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      const items = await Model.find({}).lean();
      return items.map(item => {
        const { _id, __v, ...rest } = item;
        return rest;
      });
    }
  }
  const db = getDb();
  return db[collectionName] || [];
};

export const saveCollection = (collectionName, items) => {
  const db = getDb();
  db[collectionName] = items;
  saveDb(db);
};

export const getItemById = async (collectionName, id) => {
  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      const item = await Model.findOne({ id }).lean();
      if (item) {
        const { _id, __v, ...rest } = item;
        return rest;
      }
      return null;
    }
  }
  const db = getDb();
  const items = db[collectionName] || [];
  return items.find(item => item.id === id) || null;
};

import mongoose from 'mongoose';

// Schemas
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String },
  department: { type: String },
  avatar: { type: String }
}, { timestamps: true });

const vehicleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true },
  model: { type: String },
  type: { type: String },
  capacity: { type: Number },
  mileage: { type: Number },
  status: { type: String }
}, { timestamps: true });

const driverSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  fullName: { type: String },
  licenseNumber: { type: String },
  licenseCategory: { type: String },
  phone: { type: String },
  licenseExpiryDate: { type: String },
  licenseExpiry: { type: String },
  safetyScore: { type: Number, default: 100 },
  status: { type: String }
}, { timestamps: true });

const tripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  source: { type: String },
  destination: { type: String },
  vehicleId: { type: String },
  driverId: { type: String },
  cargoWeight: { type: Number },
  distance: { type: Number },
  revenue: { type: Number, default: 0 },
  status: { type: String },
  startTime: { type: Date },
  endTime: { type: Date }
}, { timestamps: true });

const maintenanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleId: { type: String },
  issue: { type: String },
  cost: { type: Number },
  date: { type: String },
  status: { type: String }
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleId: { type: String },
  type: { type: String },
  cost: { type: Number },
  date: { type: String },
  description: { type: String }
}, { timestamps: true });

const fuelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleId: { type: String },
  liters: { type: Number },
  cost: { type: Number },
  date: { type: String }
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  message: { type: String },
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

      localDb[name] = mongoItems.map(item => {
        const { _id, __v, ...rest } = item;
        return rest;
      });
    }

    saveDb(localDb);
    console.log('✓ Database synchronized with MongoDB Atlas cloud records.');
  } catch (err) {
    console.error('✗ Database synchronization failed:', err.message);
  }
};

export const insertItem = async (collectionName, item) => {
  const newItem = {
    id: item.id || `${collectionName.slice(0, 3)}-${Math.random().toString(36).substr(2, 9)}`,
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  };

  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      const created = await Model.create(newItem);
      const obj = created.toObject();
      const { _id, __v, ...rest } = obj;
      return rest;
    }
  }

  const db = getDb();
  const items = db[collectionName] || [];
  items.push(newItem);
  saveCollection(collectionName, items);
  return newItem;
};

export const updateItemById = async (collectionName, id, updates) => {
  const updatedAt = new Date().toISOString();
  
  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      const updated = await Model.findOneAndUpdate({ id }, { ...updates, updatedAt }, { new: true }).lean();
      if (updated) {
        const { _id, __v, ...rest } = updated;
        return rest;
      }
      return null;
    }
  }

  const db = getDb();
  const items = db[collectionName] || [];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt };
  saveCollection(collectionName, items);
  return items[index];
};

export const deleteItemById = async (collectionName, id) => {
  if (isMongoConnected) {
    const Model = models[collectionName];
    if (Model) {
      const result = await Model.deleteOne({ id });
      return result.deletedCount > 0;
    }
  }

  const db = getDb();
  const items = db[collectionName] || [];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  saveCollection(collectionName, items);
  return true;
};
