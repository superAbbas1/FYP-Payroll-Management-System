// Quick MongoDB Connection Tester
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Diagnostics\n');
console.log('📋 Connection Details:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Parse the connection string to show details
const mongoUri = process.env.MONGO_URI;
console.log(`Connection String: ${mongoUri}`);

// Extract cluster info
const clusterMatch = mongoUri.match(/@([^.]+\.[^.]+\.[^.]+)\./);
const cluster = clusterMatch ? clusterMatch[1] : 'Unknown';
console.log(`Cluster: ${cluster}`);

const userMatch = mongoUri.match(/\/\/([^:]+):/);
const user = userMatch ? userMatch[1] : 'Unknown';
console.log(`Username: ${user}`);

const dbMatch = mongoUri.match(/\/(\w+)\?/);
const database = dbMatch ? dbMatch[1] : 'Unknown';
console.log(`Database: ${database}`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔗 Attempting connection...\n');

// Test DNS resolution
const dns = require('dns').promises;
(async () => {
  try {
    // Test DNS resolution for MongoDB Atlas
    const hostMatch = mongoUri.match(/@([^/]+)\//);
    const host = hostMatch ? hostMatch[1] : null;
    
    if (host) {
      console.log(`🔎 Testing DNS resolution for: ${host}`);
      try {
        const address = await dns.resolve4(host.replace(/:\d+/, ''));
        console.log(`✅ DNS resolved to: ${address.join(', ')}\n`);
      } catch (e) {
        console.log(`❌ DNS resolution failed: ${e.message}\n`);
      }
    }

    // Try MongoDB connection with timeout
    const connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 5000,
    });

    await connectionPromise;
    
    console.log('✅ Successfully connected to MongoDB!\n');
    console.log('📊 Connection Info:');
    console.log(`  - Host: ${mongoose.connection.host}`);
    console.log(`  - Port: ${mongoose.connection.port}`);
    console.log(`  - Database: ${mongoose.connection.db.name}`);
    console.log(`  - State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.log(`❌ Connection failed!\n`);
    console.log('📋 Error Details:');
    console.log(`  - Error: ${error.message}`);
    console.log(`  - Code: ${error.code || 'N/A'}\n`);
    
    console.log('🔧 Troubleshooting Steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Check your internet connection');
    console.log('   → Open https://www.google.com in browser');
    console.log('');
    console.log('2. Verify MongoDB Atlas IP Whitelist');
    console.log('   → Go to: https://cloud.mongodb.com');
    console.log('   → Project → Network Access');
    console.log('   → Add your IP address (or 0.0.0.0/0 for all IPs)');
    console.log('   → Restart server after whitelisting');
    console.log('');
    console.log('3. Check MongoDB Cluster Status');
    console.log('   → Go to: https://cloud.mongodb.com');
    console.log('   → Project → Databases');
    console.log('   → Ensure cluster0 is "Running" (not paused)');
    console.log('');
    console.log('4. Verify .env file');
    console.log('   → Check backend/.env has correct MONGO_URI');
    console.log('   → No spaces or special characters at start/end');
    console.log('');
    console.log('5. Test DNS from Command Line');
    console.log('   → Run: nslookup cluster0.nqssisu.mongodb.net');
    console.log('   → Should show IP addresses if DNS works');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(1);
  }
})();
