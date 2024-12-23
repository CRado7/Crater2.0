const db = require('../config/connection');
const { User, Apparel, Snowboard, Cart, SiteStats } = require('../models');
const userSeeds = require('./userSeeds.json');
const apparelSeeds = require('./apparelSeeds.json');
const snowboardSeeds = require('./snowboardsSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // Clean the collections
    await cleanDB('User', 'users');
    await cleanDB('Apparel', 'apparel');
    await cleanDB('Snowboard', 'snowboards');
    await cleanDB('Cart', 'carts');
    await cleanDB('SiteStats', 'sitestats');

    // Seed User data
    await User.create(userSeeds);

    // Seed Apparel data with duplicate check
    for (const apparel of apparelSeeds) {
      const existingApparel = await Apparel.findOne({ name: apparel.name });
      if (!existingApparel) {
        await Apparel.create(apparel);
      }
    }

    // Seed Snowboard data
    for (const snowboard of snowboardSeeds) {
      const existingSnowboard = await Snowboard.findOne({ name: snowboard.name });
      if (!existingSnowboard) {
        await Snowboard.create(snowboard);
      }
    }

    console.log('User, Apparel, and Snowboard data seeded successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
});
