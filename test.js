const mongoose = require('mongoose');
const SofaCarpetService = require('./models/SofaCarpetService');

// MongoDB connection
mongoose.connect('mongodb+srv://dharshini001:dharshini@cluster0.onf7x.mongodb.net/sterilease')
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    try {
      // Test creating a service
      const testService = new SofaCarpetService({
        name: "Test Service",
        price: "100",
        time: "2 hours",
        description: "Test description",
        providerEmail: "test@example.com"
      });
      
      const saved = await testService.save();
      console.log('Test service saved:', saved);
      
      // Test finding services
      const services = await SofaCarpetService.find({ providerEmail: "test@example.com" });
      console.log('Found services:', services);
      
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  }); 