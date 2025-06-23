const express = require('express');
const router = express.Router();

// Import all service routes
const plumbingRoutes = require('./plumbingServiceRoutes');
const electricalRoutes = require('./electricalServiceRoutes');
const acRoutes = require('./acServiceRoutes');
const carpentryRoutes = require('./carpentryServiceRoutes');
const bathroomRoutes = require('./bathroomServiceRoutes');
const geyserRoutes = require('./geyserServiceRoutes');
const washingMachineRoutes = require('./washingMachineServiceRoutes');
const televisionRoutes = require('./televisionServiceRoutes');
const pestControlRoutes = require('./pestControlServiceRoutes');
const sofaCarpetRoutes = require('./sofaCarpetServiceRoutes');

// Mount all service routes
router.use('/plumbing', plumbingRoutes);
router.use('/electrical', electricalRoutes);
router.use('/ac', acRoutes);
router.use('/carpentry', carpentryRoutes);
router.use('/bathroom-services', bathroomRoutes);
router.use('/geyser', geyserRoutes);
router.use('/washing-machine', washingMachineRoutes);
router.use('/television', televisionRoutes);
router.use('/pest-control', pestControlRoutes);
router.use('/sofa-carpet', sofaCarpetRoutes);

// Get all available services
router.get('/', async (req, res) => {
  try {
    const services = [
      { id: 'plumbing', name: 'Plumbing Services' },
      { id: 'electrical', name: 'Electrical Services' },
      { id: 'ac', name: 'AC Services' },
      { id: 'carpentry', name: 'Carpentry Services' },
      { id: 'bathroom', name: 'Bathroom Services' },
      { id: 'geyser', name: 'Geyser Services' },
      { id: 'washing-machine', name: 'Washing Machine Services' },
      { id: 'television', name: 'Television Services' },
      { id: 'pest-control', name: 'Pest Control Services' },
      { id: 'sofa-carpet', name: 'Sofa & Carpet Services' }
    ];
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
});

module.exports = router; 