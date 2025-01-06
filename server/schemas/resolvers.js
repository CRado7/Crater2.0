const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { User, Snowboard, Apparel, SiteStats, Cart } = require('../models');
const { signToken } = require('../utils/auth');
const mongoose = require('mongoose');

require('dotenv').config();  // Ensure environment variables are loaded

const resolvers = {
  Query: {
    getCart: async (_, __, context) => {
      if (!context.sessionID) {
          throw new Error("Session ID is missing from the context.");
      }

      console.log("Session ID in getCart:", context.sessionID);

      const cart = await Cart.findOne({ sessionId: context.sessionID });
      
      if (!cart) {
          return { id: null, sessionId: context.sessionID, items: [] };
      }

      // Populate product details
      await Promise.all(
          cart.items.map(async (item) => {
              try {
                  const ProductModel = mongoose.model(
                      item.type.charAt(0).toUpperCase() + item.type.slice(1)
                  );
                  const product = await ProductModel.findById(item.productId);

                  if (product) {
                      item.name = product.name || item.name;
                      item.picture = product.picture || item.picture;
                      item.price = product.price || item.price;
                  }
              } catch (err) {
                  console.error(`Error fetching product for type: ${item.type}`, err);
              }
          })
      );

      return cart;
    },

    // Fetch a single user by ID
    getUser: async (_, { id }) => {
      try {
        return await User.findById(id);
      } catch (err) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND');
      }
    },

    // Fetch all users
    getAllUsers: async () => {
      return await User.find();
    },

    // Fetch a single snowboard by ID (not authenticated)
    getSnowboard: async (_, { id }) => {
      try {
        return await Snowboard.findById(id);
      } catch (err) {
        throw new ApolloError('Snowboard not found', 'SNOWBOARD_NOT_FOUND');
      }
    },

    // Fetch all snowboards (not authenticated and authenticated)
    getAllSnowboards: async () => {
      return await Snowboard.find();
    },

    getFeaturedSnowboards: async (_, { id }) => {
      return await Snowboard.find({ featured: true });
    },

    // Fetch a single apparel item by ID (not authenticated)
    getApparel: async (_, { id }) => {
      try {
        return await Apparel.findById(id);
      } catch (err) {
        throw new ApolloError('Apparel not found', 'APPAREL_NOT_FOUND');
      }
    },

    // Fetch all apparel items (not authenticated and authenticated)
    getAllApparel: async () => {
      return await Apparel.find();
    },

    getFeaturedApparel: async (_, { id }) => {
      return await Apparel.find({ featured: true });
    },

    topApparelByViews: async (_, { limit = 3 }) => {
      return await Apparel.find().sort({ views: -1 }).limit(limit);
    },

    topSnowboardByViews: async (_, { limit = 1 }) => {
      return await Snowboard.find().sort({ views: -1 }).limit(limit);
    },

    // General stats for the site (authenticated)
    async getSiteStats() {
      let stats = await SiteStats.findOne();
    
      // If stats don't exist, create a new document with initial values
      if (!stats) {
        stats = await SiteStats.create({
          totalViews: 0,
          uniqueVisits: 0,
          monthlyStats: [] // Initialize empty monthlyStats array
        });
      }
    
      // If monthlyStats is not present or empty, initialize it
      if (!stats.monthlyStats || stats.monthlyStats.length === 0) {
        stats.monthlyStats = [];
      }
    
      return stats;
    },

    // Snowboard-specific stats (authenticated)
    snowboardStats: async () => {
      const mostViewedBoard = await Snowboard.findOne().sort({ views: -1 }).limit(1);

      return { mostViewedBoard };
    },

    // Apparel-specific stats (authenticated)
    apparelStats: async () => {
      const mostViewedApparel = await Apparel.findOne().sort({ views: -1 }).limit(1);

      return { mostViewedApparel };
    },
  },

  Mutation: {
    addToCart: async (_, { input }, context) => {
      if (!context.sessionID) {
          throw new Error("Session ID is missing from the context.");
      }

      console.log("Session ID in addToCart:", context.sessionID);

      const { productId, quantity, name, size, type, picture, price } = input;

      let cart = await Cart.findOne({ sessionId: context.sessionID });
      if (!cart) {
          cart = new Cart({ sessionId: context.sessionID, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(item => 
          item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += quantity;
      } else {
          cart.items.push({ productId, quantity, name, size, type, picture, price });
      }

      await cart.save();
      return cart;
    },
    
    removeFromCart: async (_, { input }, { sessionID }) => {
      const { productId } = input;

      // Find the cart using the session ID
      const cart = await Cart.findOne({ sessionId: sessionID });

      if (!cart) {
        throw new Error('Cart not found');
      }

      // Filter out the item to remove it from the cart
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);

      // Save the updated cart
      await cart.save();
      return cart;
    },

    updateCartQuantity: async (_, { input }, { sessionID }) => {
      const { productId, quantity } = input;
    
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
    
      const cart = await Cart.findOne({ sessionId: sessionID });
      if (!cart) {
        throw new Error('Cart not found');
      }
    
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (!item) {
        throw new Error('Item not found in cart');
      }
    
      item.quantity = quantity;
      await cart.save();
    
      return cart;
    },

    // Create a new snowboard (authenticated)
    createSnowboard: async (_, { pictures, name, shape, sizes, flex, boardConstruction, price, featured }) => {
      const snowboard = new Snowboard({
        pictures,
        name,
        shape,
        sizes: sizes.map(({ size, inStock }) => ({ size, inStock })),  // Map sizes to include inStock for each size
        flex,
        boardConstruction,
        price,
        featured,
      });
      await snowboard.save();
      return snowboard;
    },

    // Create a new apparel item (authenticated)
    createApparel: async (_, { pictures, name, style, sizes, price, featured }) => {
      const apparel = new Apparel({
        pictures,
        name,
        style,
        sizes: sizes.map(({ size, inStock }) => ({ size, inStock })),  // Map sizes to include inStock for each size
        price,
        featured,
      });
      await apparel.save();
      return apparel;
    },

    // Update a snowboard (authenticated)
    updateSnowboard: async (_, { id, input, featured }) => {
      try {
        const snowboard = await Snowboard.findById(id);
        if (!snowboard) {
          throw new ApolloError("Snowboard not found", "SNOWBOARD_NOT_FOUND");
        }

        // Update each size's inStock value
        input.forEach(({ size, inStock }) => {
          const sizeToUpdate = snowboard.sizes.find(s => s.size === size);
          if (sizeToUpdate) {
            sizeToUpdate.inStock = inStock;
          }
        });

        if (typeof featured !== 'undefined') {
          snowboard.featured = featured;
        }

        // Save the updated snowboard
        await snowboard.save();
        return snowboard;
      } catch (error) {
        throw new ApolloError(`Error updating snowboard: ${error.message}`, 'SNOWBOARD_UPDATE_FAILED');
      }
    },

    // Update an apparel item (authenticated)
    updateApparel: async (_, { id, input, featured }) => {
      console.log("Received input:", input);
      console.log("Received featured:", featured);
      
      try {
        const apparel = await Apparel.findById(id);
        if (!apparel) {
          throw new ApolloError("Apparel item not found.", "APPAREL_NOT_FOUND");
        }
    
        if (input) {
          input.forEach(({ size, inStock }) => {
            const sizeToUpdate = apparel.sizes.find(s => s.size === size);
            if (sizeToUpdate) {
              sizeToUpdate.inStock = inStock;
            }
          });
        }
    
        if (typeof featured !== "undefined") {
          apparel.featured = featured;
        }
    
        await apparel.save();
        return apparel;
      } catch (error) {
        throw new ApolloError(`Error updating apparel item: ${error.message}`, "APPAREL_UPDATE_FAILED");
      }
    },
    
    // Delete a snowboard (authenticated)
    deleteSnowboard: async (_, { id }) => {
      try {
        const deletedSnowboard = await Snowboard.findByIdAndDelete(id);
        if (!deletedSnowboard) {
          throw new ApolloError('Snowboard not found', 'SNOWBOARD_NOT_FOUND');
        }
        return deletedSnowboard;
      } catch (err) {
        throw new ApolloError(`Error deleting snowboard: ${err.message}`, 'SNOWBOARD_DELETE_FAILED');
      }
    },

    // Delete an apparel item (authenticated)
    deleteApparel: async (_, { id }) => {
      try {
        const deletedApparel = await Apparel.findByIdAndDelete(id);
        if (!deletedApparel) {
          throw new ApolloError('Apparel item not found', 'APPAREL_NOT_FOUND');
        }
        return deletedApparel;
      } catch (err) {
        throw new ApolloError(`Error deleting apparel item: ${err.message}`, 'APPAREL_DELETE_FAILED');
      }
    },
    incrementApparelViews: async (_, { _id }) => {
      try {
        // Try to find the apparel item by ID
        const apparel = await Apparel.findById(_id);
        
        if (!apparel) {
          throw new Error('Apparel item not found');
        }

        // Increment the views count
        apparel.views = (apparel.views || 0) + 1;

        // Save the updated apparel item
        await apparel.save();

        return apparel; // Returning the updated apparel object
      } catch (error) {
        console.error('Error in incrementApparelViews resolver:', error);
        throw new Error(`Error incrementing views: ${error.message}`);
      }
    },
    incrementSnowboardViews: async (_, { _id }) => {
      try {
        // Try to find the apparel item by ID
        const snowboard = await Snowboard.findById(_id);
        
        if (!snowboard) {
          throw new Error('Board item not found');
        }

        // Increment the views count
        snowboard.views = (snowboard.views || 0) + 1;

        // Save the updated apparel item
        await snowboard.save();

        return snowboard; // Returning the updated apparel object
      } catch (error) {
        console.error('Error in incrementSnowboardViews resolver:', error);
        throw new Error(`Error incrementing views: ${error.message}`);
      }
    },
        // Increment total views and unique visits
        async incrementSiteStats(_, __, context) {
          const sessionId = context.sessionID; // Use the session ID from the context
          if (!sessionId) {
            throw new Error('Session ID not found.');
          }
        
          // Fetch the stats document
          let stats = await SiteStats.findOne();
          console.log('SiteStats document before update:', stats); // Log the current stats document
        
          if (!stats) {
            stats = await SiteStats.create({
              totalViews: 0,
              uniqueVisits: 0,
              uniqueSessions: [], // Initialize uniqueSessions as an empty array
              monthlyStats: [],
            });
            console.log('New SiteStats document created:', stats);
          }
        
          // Increment total views
          stats.totalViews += 1;
        
          // Ensure uniqueSessions is initialized
          if (!stats.uniqueSessions) stats.uniqueSessions = [];
        
          // Check if the session is new for the global unique sessions
          if (!stats.uniqueSessions.includes(sessionId)) {
            stats.uniqueSessions.push(sessionId);
            stats.uniqueVisits += 1; // Increment unique visits for a new session
          }
        
          // Get the current month and year
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
        
          // Find or create the monthly stats for the current month and year
          let monthlyStat = stats.monthlyStats.find(
            (stat) => stat.year === currentYear && stat.month === currentMonth
          );
        
          console.log('MonthlyStat before update:', monthlyStat); // Log the monthlyStat
        
          if (!monthlyStat) {
            // If no monthly stats exist for this month, create it
            monthlyStat = {
              year: currentYear,
              month: currentMonth,
              totalViews: 1,
              uniqueVisits: 1,
              uniqueSessions: [sessionId],
            };
            stats.monthlyStats.push(monthlyStat);
          } else {
            // Ensure uniqueSessions is initialized
            if (!monthlyStat.uniqueSessions) monthlyStat.uniqueSessions = [];
        
            // Increment total views for the current month
            monthlyStat.totalViews++;
        
            // Check if the session is unique for this month and increment accordingly
            if (!monthlyStat.uniqueSessions.includes(sessionId)) {
              monthlyStat.uniqueVisits++;
              monthlyStat.uniqueSessions.push(sessionId);
            }
          }
        
          // Save the updated stats
          await stats.save();
        
          console.log('SiteStats document after update:', stats); // Log the updated stats document
        
          return {
            totalViews: stats.totalViews,
            uniqueVisits: stats.uniqueVisits,
            monthlyStats: stats.monthlyStats,
          };
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
