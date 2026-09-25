import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripgenie';
    try {
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (initialErr) {
      if (initialErr.code === 'ECONNREFUSED' && initialErr.syscall === 'querySrv') {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(connUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected (via DNS fallback): ${conn.connection.host}`);
        return conn;
      }
      throw initialErr;
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server is running. Ensure MongoDB Atlas or Local MongoDB is started and reachable.');
    return null;
  }
};

export default connectDB;

