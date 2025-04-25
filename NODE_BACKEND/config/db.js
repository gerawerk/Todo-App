const mongoose = require('mongoose');
require('dotenv').config();
const colors = require('colors');

const connectDB = async () => {
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000, // Set a larger socket timeout
    maxPoolSize: 10, // Maximum pool size
    retryWrites: true,
    w: 'majority', // Wait for acknowledgment
  };

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env'.red.bold);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    console.log(`Database Name: ${conn.connection.name}`.blue);

    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to DB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`🔴 Mongoose connection error: ${err.message}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('🟡 Mongoose disconnected'.yellow);
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`.red.bold);
    console.error(`Connection URI: ${process.env.MONGODB_URI.replace(/:\/\/.*@/, '://[REDACTED]@')}`);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  await mongoose.connection.close();
  console.log(`\n🛑 Mongoose disconnected via ${signal}`.yellow);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = connectDB;
