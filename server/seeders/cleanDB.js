const models = require('../models');
const db = require('../config/connection');

module.exports = async (modelName, collectionName) => {
  try {
    const model = models[modelName];
    if (!model) {
      throw new Error(`Model ${modelName} not found in models.`);
    }

    const collection = await db.db.listCollections({ name: collectionName }).toArray();

    console.log(`Checking if ${collectionName} exists...`);

    if (collection.length) {
      await db.db.dropCollection(collectionName);
      console.log(`${collectionName} collection dropped successfully!`);
    } else {
      console.log(`${collectionName} does not exist, skipping drop.`);
    }
  } catch (err) {
    console.error(`Error cleaning collection: ${err}`);
    throw err;
  }
};

