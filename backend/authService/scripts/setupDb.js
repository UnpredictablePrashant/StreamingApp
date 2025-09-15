const mongoose = require('mongoose');
const { User } = require('../models/user.model');

const setupDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/streamingapp';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if users collection exists and create it if it doesn't
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasUsersCollection = collections.some(col => col.name === 'users');
    
    if (!hasUsersCollection) {
      console.log('Creating users collection...');
      await mongoose.connection.db.createCollection('users');
      console.log('Users collection created');
    } else {
      console.log('Users collection already exists');
    }

    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Email index created');

    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
};

setupDatabase();
