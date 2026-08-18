/**
 * Setup Script - Create Initial Admin Account
 * 
 * Run this once to create your admin account:
 * node src/setup-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('⚠ Admin account already exists!');
      console.log('Username:', existingAdmin.username);
      
      const overwrite = await question('\nDo you want to create a new admin? This will delete the existing one. (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
      
      await Admin.deleteMany({});
      console.log('✓ Existing admin deleted');
    }

    // Get admin credentials
    console.log('\n--- Create Admin Account ---\n');
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');

    if (!username || !password) {
      console.log('✗ Username and password are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('✗ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Create admin
    const admin = new Admin({ username, password });
    await admin.save();

    console.log('\n✓ Admin account created successfully!');
    console.log('Username:', username);
    console.log('\n🔐 You can now login to the admin panel using Ctrl + Shift + A');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    mongoose.connection.close();
    process.exit(0);
  }
}

setupAdmin();
