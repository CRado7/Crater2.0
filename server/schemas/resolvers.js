const { AuthenticationError } = require('apollo-server-express');
const { User, Snowboard, Apparel, Sales, siteStats } = require('../models');
const { signToken } = require('../utils/auth');

// Secret key for JWT signing
const JWT_SECRET = 'your_secret_key';  // Make sure to store this in .env for security

const resolvers = {
  Query: {
    // Fetch a single user by ID
    getUser: async (_, { id }) => {
      try {
        return await User.findById(id);
      } catch (err) {
        throw new Error('User not found');
      }
    },
    // Fetch all users
    getAllUsers: async () => {
      return await User.find();
    },
    // Fetch a single snowboard by ID
    getSnowboard: async (_, { id }) => {
      try {
        return await Snowboard.findById(id);
      } catch (err) {
        throw new Error('Snowboard not found');
      }
    },
    // Fetch all snowboards
    getAllSnowboards: async () => {
      return await Snowboard.find();
    },
    // Fetch a single apparel item by ID
    getApparel: async (_, { id }) => {
      try {
        return await Apparel.findById(id);
      } catch (err) {
        throw new Error('Apparel not found');
      }
    },
    // Fetch all apparel items
    getAllApparel: async () => {
      return await Apparel.find();
    },
    // General stats for the site
    generalStats: async () => {
      const stats = await siteStats.findOne();
      const salesData = await Sales.aggregate([
        { $group: { _id: { month: "$month", itemType: "$itemType" }, total: { $sum: "$amount" } } },
      ]);

      return { stats, salesData };
    },
    // Snowboard-specific stats
    snowboardStats: async () => {
      const mostViewedBoard = await Snowboard.findOne().sort({ views: -1 }).limit(1);
      const salesData = await Sales.find({ itemType: "snowboard" });

      return { mostViewedBoard, salesData };
    },
    // Apparel-specific stats
    apparelStats: async () => {
      const mostViewedApparel = await Apparel.findOne().sort({ views: -1 }).limit(1);
      const salesData = await Sales.find({ itemType: "apparel" });

      return { mostViewedApparel, salesData };
    },
  },
  Mutation: {
    // Create a new user
    createUser: async (_, { username, password }) => {
      const user = new User({ username, password });
      await user.save();
      return user;
    },
    // Create a new snowboard
    createSnowboard: async (_, { picture, name, shape, sizes, flex, boardConstruction, price }) => {
      const snowboard = new Snowboard({
        picture,
        name,
        shape,
        sizes: sizes.map(({ size, inStock }) => ({ size, inStock })),  // Map sizes to include inStock for each size
        flex,
        boardConstruction,
        price,
      });
      await snowboard.save();
      return snowboard;
    },
    // Create a new apparel item
    createApparel: async (_, { pictures, name, style, sizes, price }) => {
      const apparel = new Apparel({
        pictures,
        name,
        style,
        sizes: sizes.map(({ size, inStock }) => ({ size, inStock })),  // Map sizes to include inStock for each size
        price,
      });
      await apparel.save();
      return apparel;
    },
    deleteSnowboard: async (_, { id }) => {
      try {
        const deletedSnowboard = await Snowboard.findByIdAndDelete(id);
        if (!deletedSnowboard) {
          throw new Error('Snowboard not found');
        }
        return deletedSnowboard; // Return the deleted snowboard object
      } catch (err) {
        throw new Error(`Error deleting snowboard: ${err.message}`);
      }
    },

    // Delete an apparel item
    deleteApparel: async (_, { id }) => {
      try {
        const deletedApparel = await Apparel.findByIdAndDelete(id);
        if (!deletedApparel) {
          throw new Error('Apparel item not found');
        }
        return deletedApparel; // Return the deleted apparel item
      } catch (err) {
        throw new Error(`Error deleting apparel item: ${err.message}`);
      }
    },
    // Login mutation to authenticate user and return JWT token
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    
    // Logout mutation (client-side logic for clearing the token)
    logout: () => {
      return 'Logged out successfully';
    }
  }
};

module.exports = resolvers;
