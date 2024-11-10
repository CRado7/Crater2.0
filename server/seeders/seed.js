const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // Clean the User collection
    await cleanDB('User', 'users');

    // Seed User data
    await User.create(userSeeds);

    console.log('User data seeded successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
});
