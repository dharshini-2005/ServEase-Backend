const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  console.log('Request query:', req.query);
  next();
});

// MongoDB Connection
mongoose.connect('mongodb+srv://dharshiniextra:dharshini@cluster0.x5ygb8m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas successfully');
})
.catch(err => {
  console.error('MongoDB Atlas connection error:', err);
  process.exit(1);
});

// Import routes
const authRoutes = require('./routes/auth');
const homeCleaningRoutes = require('./routes/homeCleaningServiceRoutes');
const homeCleaningBookingRoutes = require('./routes/homeCleaningBookingRoutes');
const sofaCarpetServiceRoutes = require('./routes/sofaCarpetServiceRoutes');
const sofaCarpetBookingRoutes = require('./routes/sofaCarpetBookingRoutes');
const acServiceRoutes = require('./routes/acServiceRoutes');
const acBookingRoutes = require('./routes/acBookingRoutes');
const washingMachineServiceRoutes = require('./routes/washingMachineServiceRoutes');
const washingMachineBookingRoutes = require('./routes/washingMachineBookingRoutes');
const plumbingServiceRoutes = require('./routes/plumbingServiceRoutes');
const plumbingBookingRoutes = require('./routes/plumbingBookingRoutes');
const carpentryServiceRoutes = require('./routes/carpentryServiceRoutes');
const carpentryBookingRoutes = require('./routes/carpentryBookingRoutes');
const televisionServiceRoutes = require('./routes/televisionServiceRoutes');
const televisionBookingRoutes = require('./routes/televisionBookingRoutes');
const electricalServiceRoutes = require('./routes/electricalServiceRoutes');
const electricalBookingRoutes = require('./routes/electricalBookingRoutes');
const cockroachAntandPestControlRoutes = require('./routes/cockroachAntandPestControlRoutes');
const cockroachAntandPestControlBookingRoutes = require('./routes/cockroachAntandPestControlBookingRoutes');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Test route for sofa-carpet services
app.get('/api/test/sofa-carpet', (req, res) => {
  res.json({ message: 'Sofa carpet routes are working' });
});

// Test route for AC services
app.get('/api/test/ac', async (req, res) => {
  try {
    const ACService = require('./models/ACService');
    const count = await ACService.countDocuments();
    res.json({ 
      message: 'AC services routes are working',
      serviceCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Error in AC test route:', error);
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test route for washing machine services
app.get('/api/test/washing-machine', async (req, res) => {
  try {
    const WashingMachineService = require('./models/WashingMachineService');
    const count = await WashingMachineService.countDocuments();
    res.json({ 
      message: 'Washing machine services routes are working',
      serviceCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Error in washing machine test route:', error);
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test route for television services
app.get('/api/test/television', async (req, res) => {
  try {
    const TelevisionService = require('./models/TelevisionService');
    const count = await TelevisionService.countDocuments();
    res.json({ 
      message: 'Television services routes are working',
      serviceCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Error in television test route:', error);
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test route for electrical services
app.get('/api/test/electrical', async (req, res) => {
  try {
    const ElectricalService = require('./models/ElectricalService');
    const count = await ElectricalService.countDocuments();
    res.json({ 
      message: 'Electrical services routes are working',
      serviceCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Error in electrical test route:', error);
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test route for cockroach ant and pest control services
app.get('/api/test/cockroach-ant-pest', async (req, res) => {
  try {
    const CockroachAntandPestControl = require('./models/CockroachAntandPestControl');
    const count = await CockroachAntandPestControl.countDocuments();
    res.json({ 
      message: 'Cockroach Ant and Pest Control services routes are working',
      serviceCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Error in cockroach ant and pest control test route:', error);
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Register routes with proper error handling
app.use('/api/auth', authRoutes);
app.use('/api/services/home-cleaning', homeCleaningRoutes);
app.use('/api/bookings/home-cleaning', homeCleaningBookingRoutes);
app.use('/api/services/sofa-carpet', sofaCarpetServiceRoutes);
app.use('/api/bookings/sofa-carpet', sofaCarpetBookingRoutes);
app.use('/api/services/ac', acServiceRoutes);
app.use('/api/bookings/ac', acBookingRoutes);
app.use('/api/services/washing-machine', washingMachineServiceRoutes);
app.use('/api/bookings/washing-machine', washingMachineBookingRoutes);
app.use('/api/services/plumbing', plumbingServiceRoutes);
app.use('/api/bookings/plumbing', plumbingBookingRoutes);
app.use('/api/services/carpentry', carpentryServiceRoutes);
app.use('/api/bookings/carpentry', carpentryBookingRoutes);
app.use('/api/services/television', televisionServiceRoutes);
app.use('/api/bookings/television', televisionBookingRoutes);
app.use('/api/services/electrical', electricalServiceRoutes);
app.use('/api/bookings/electrical', electricalBookingRoutes);
app.use('/api/services/cockroach-ant-pest', cockroachAntandPestControlRoutes);
app.use('/api/bookings/cockroach-ant-pest', cockroachAntandPestControlBookingRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/health');
  console.log('- GET /api/test/sofa-carpet');
  console.log('- GET /api/services/sofa-carpet');
  console.log('- GET /api/services/sofa-carpet/provider/:providerEmail');
  console.log('- POST /api/services/sofa-carpet');
  console.log('- GET /api/bookings/sofa-carpet/customer/:email');
  console.log('- POST /api/bookings/sofa-carpet');
  console.log('- GET /api/services/ac');
  console.log('- GET /api/services/ac/provider/:providerEmail');
  console.log('- POST /api/services/ac');
  console.log('- GET /api/bookings/ac/customer/:email');
  console.log('- POST /api/bookings/ac');
  console.log('- GET /api/services/washing-machine');
  console.log('- GET /api/services/washing-machine/provider/:providerEmail');
  console.log('- POST /api/services/washing-machine');
  console.log('- GET /api/bookings/washing-machine/customer/:email');
  console.log('- POST /api/bookings/washing-machine');
  console.log('- GET /api/services/plumbing');
  console.log('- GET /api/services/plumbing/provider/:providerEmail');
  console.log('- POST /api/services/plumbing');
  console.log('- GET /api/bookings/plumbing/customer/:email');
  console.log('- POST /api/bookings/plumbing');
  console.log('- GET /api/services/carpentry');
  console.log('- GET /api/services/carpentry/provider/:providerEmail');
  console.log('- POST /api/services/carpentry');
  console.log('- GET /api/bookings/carpentry/customer/:email');
  console.log('- POST /api/bookings/carpentry');
  console.log('- GET /api/services/television');
  console.log('- GET /api/services/television/provider/:providerEmail');
  console.log('- POST /api/services/television');
  console.log('- GET /api/bookings/television/customer/:email');
  console.log('- POST /api/bookings/television');
  console.log('- GET /api/services/electrical');
  console.log('- GET /api/services/electrical/provider/:providerEmail');
  console.log('- POST /api/services/electrical');
  console.log('- GET /api/bookings/electrical/customer/:email');
  console.log('- POST /api/bookings/electrical');
  console.log('- GET /api/services/cockroach-ant-pest');
  console.log('- GET /api/services/cockroach-ant-pest/provider/:providerEmail');
  console.log('- GET /api/services/cockroach-ant-pest/type/:type');
  console.log('- POST /api/services/cockroach-ant-pest');
  console.log('- PUT /api/services/cockroach-ant-pest/:id');
  console.log('- DELETE /api/services/cockroach-ant-pest/:id');
  console.log('- PATCH /api/services/cockroach-ant-pest/:id/availability');
  console.log('- GET /api/bookings/cockroach-ant-pest');
  console.log('- GET /api/bookings/cockroach-ant-pest/customer/:email');
  console.log('- GET /api/bookings/cockroach-ant-pest/provider/:email');
  console.log('- POST /api/bookings/cockroach-ant-pest');
  console.log('- PATCH /api/bookings/cockroach-ant-pest/:id/status');
  console.log('- PATCH /api/bookings/cockroach-ant-pest/:id/cancel');
});