const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
  }

  type SnowboardSize {
    size: String!
    inStock: Int!
  }

  type Snowboard {
    _id: ID
    pictures: [String!]!
    name: String!
    shape: String!
    sizes: [SnowboardSize!]!
    flex: String!
    boardConstruction: String!
    price: Float!
    views: Int
    featured: Boolean
  }

  type ApparelSize {
    size: String!
    inStock: Int!
  }

  type Apparel {
    _id: ID
    pictures: [String!]!
    name: String!
    style: String!
    sizes: [ApparelSize!]! 
    price: Float!
    views: Int
    featured: Boolean
  }

  type CartItem {
    productId: ID!
    quantity: Int!
    name: String!
    size: String!
    type: String!
    picture: String!
    price: Float!
  }

  type Cart {
    id: ID!
    sessionId: String!
    items: [CartItem!]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type SiteStats {
    totalViews: Int!
    uniqueVisits: Int!
  }

  type MonthlyVisitorData {
    month: String!
    count: Int!
  }

  type SalesData {
    month: String!
    itemType: String!
    total: Float!
  }

  type SnowboardStats {
    mostViewedBoard: Snowboard
    salesData: [SalesData!]!
  }

  type ApparelStats {
    mostViewedApparel: Apparel
    salesData: [SalesData!]!
  }

  type Query {
    getUser(_id: ID!): User
    getAllUsers: [User!]!

    getSnowboard(id: ID!): Snowboard
    getAllSnowboards: [Snowboard!]!
    getApparel(id: ID!): Apparel
    getAllApparel: [Apparel!]!
    getCart: Cart

    getSiteStats: SiteStats!

    snowboardStats: SnowboardStats!
    apparelStats: ApparelStats!
    
    topApparelByViews(limit: Int): [Apparel]
    topSnowboardByViews(limit: Int): [Snowboard]

    getFeaturedApparel: [Apparel]
    getFeaturedSnowboards: [Snowboard]
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): Auth
    logout: String!
    
    createSnowboard(
      pictures: [String!], 
      name: String!, 
      shape: String!, 
      sizes: [SnowboardSizeInput!]!, 
      flex: String!, 
      boardConstruction: String!, 
      price: Float!
      featured: Boolean
      ): Snowboard!
      
      createApparel(
        pictures: [String!]!,
        name: String!,
        style: String!, 
        sizes: [ApparelSizeInput!]!, 
        price: Float!
        featured: Boolean
        ): Apparel!
        
      addToCart(input: AddToCartInput!): Cart
      removeFromCart(input: RemoveFromCartInput!): Cart
      
      updateSnowboard(id: ID!, input: [SnowboardSizeInput!]!, featured: Boolean): Snowboard
      updateApparel(id: ID!, input: [ApparelSizeInput!]!, featured: Boolean): Apparel
      updateCartQuantity(input: UpdateCartQuantityInput!): Cart
      
      deleteSnowboard(id: ID!): Snowboard
      deleteApparel(id: ID!): Apparel
        
      incrementApparelViews(_id: ID!): Apparel
      incrementSnowboardViews(_id: ID!): Snowboard
      incrementSiteStats: SiteStats!
    }


    input SnowboardSizeInput {
      size: String!
      inStock: Int!
      featured: Boolean
    }

    input ApparelSizeInput {
      size: String!
      inStock: Int!
    }

    input AddToCartInput {
      productId: ID!
      quantity: Int!
      name: String!
      size: String!
      type: String!
      picture: String!
      price: Float!
    }

    input UpdateCartQuantityInput {
      productId: ID!
      quantity: Int!
    }
  
    input RemoveFromCartInput {
      productId: ID!
    }
    
`;

module.exports = typeDefs;
