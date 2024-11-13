const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { User, Snowboard, Apparel, Sales, siteStats, Cart } = require('../models');
const { signToken } = require('../utils/auth');
require('dotenv').config();  // Ensure environment variables are loaded

const resolvers = {
  Query: {
    getCart: async () => {
      const cart = await Cart.findOne();
      return cart ? cart.items : [];
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

    topApparelByViews: async (_, { limit = 3 }) => {
      return await Apparel.find().sort({ views: -1 }).limit(limit);
    },

    topSnowboardByViews: async (_, { limit = 1 }) => {
      return await Snowboard.find().sort({ views: -1 }).limit(limit);
    },

    // General stats for the site (authenticated)
    generalStats: async () => {
      const stats = await siteStats.findOne();
      const salesData = await Sales.aggregate([
        { $group: { _id: { month: "$month", itemType: "$itemType" }, total: { $sum: "$amount" } } },
      ]);

      return { stats, salesData };
    },

    // Snowboard-specific stats (authenticated)
    snowboardStats: async () => {
      const mostViewedBoard = await Snowboard.findOne().sort({ views: -1 }).limit(1);
      const salesData = await Sales.find({ itemType: "snowboard" });

      return { mostViewedBoard, salesData };
    },

    // Apparel-specific stats (authenticated)
    apparelStats: async () => {
      const mostViewedApparel = await Apparel.findOne().sort({ views: -1 }).limit(1);
      const salesData = await Sales.find({ itemType: "apparel" });

      return { mostViewedApparel, salesData };
    },
  },

  Mutation: {
    addToCart: async (_, { productId, quantity, size, type }, context) => {
      try {
        // Find the product (either snowboard or apparel)
        let product;

        if (type === 'snowboard') {
          product = await Snowboard.findById(productId);
          if (!product) {
            throw new Error('Snowboard not found');
          }
        } else if (type === 'apparel') {
          product = await Apparel.findById(productId);
          if (!product) {
            throw new Error('Apparel item not found');
          }
        }

        // Ensure the size exists for apparel
        if (type === 'apparel') {
          const sizeObj = product.sizes.find(item => item.size === size);
          if (!sizeObj || sizeObj.inStock < quantity) {
            throw new Error('Not enough stock for this size');
          }
        }

        // If no user is authenticated, use a session or anonymous cart
        const cart = context.cart || [];  // Assume `context.cart` holds the user's cart or anonymous cart
        const itemIndex = cart.findIndex(item => item.productId === productId && item.size === size);
        
        if (itemIndex !== -1) {
          // Update the existing cart item
          cart[itemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          cart.push({
            productId,
            quantity,
            size,
            onModel: type,  // 'snowboard' or 'apparel'
          });
        }

        // Optionally, save the cart to the user model or session storage

        return cart;  // Return the updated cart
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw new ApolloError(error.message);
      }
    },
    removeFromCart: async (parent, { itemId }) => {
      try {
        // Find the user by their ID (adjust to however you're identifying the user)
        // Assuming the cart is either stored globally or is being passed through session data
        const user = await User.findOne({ /* your method to find the user, maybe based on session or other identifier */ });

        // If no user or no cart found, return an error or empty cart response
        if (!user || !user.cart) {
          throw new Error('Cart not found');
        }

        // Remove the item from the cart by filtering it out
        const updatedCart = user.cart.filter(item => item.productId.toString() !== itemId);

        // Update the user's cart in the database
        user.cart = updatedCart;
        await user.save();

        return user.cart; // Return the updated cart
      } catch (error) {
        throw new Error('Failed to remove item from cart: ' + error.message);
      }
    },
    // Create a new snowboard (authenticated)
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

    // Create a new apparel item (authenticated)
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

    // Update a snowboard (authenticated)
    updateSnowboard: async (_, { id, input }) => {
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

        // Save the updated snowboard
        await snowboard.save();
        return snowboard;
      } catch (error) {
        throw new ApolloError(`Error updating snowboard: ${error.message}`, 'SNOWBOARD_UPDATE_FAILED');
      }
    },

    // Update an apparel item (authenticated)
    updateApparel: async (_, { id, input }) => {
      try {
        const apparel = await Apparel.findById(id);
        if (!apparel) {
          throw new ApolloError("Apparel item not found.", "APPAREL_NOT_FOUND");
        }

        // Update each size based on input
        input.forEach(({ size, inStock }) => {
          const sizeToUpdate = apparel.sizes.find(s => s.size === size);
          if (sizeToUpdate) {
            sizeToUpdate.inStock = inStock;
          }
        });

        await apparel.save();
        return apparel;
      } catch (error) {
        throw new ApolloError(`Error updating apparel item: ${error.message}`, 'APPAREL_UPDATE_FAILED');
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
