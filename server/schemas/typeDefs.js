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
    picture: [String!]!
    name: String!
    shape: String!
    sizes: [SnowboardSize!]!
    flex: String!
    boardConstruction: String!
    price: Float!
    views: Int
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
  }

  type Cart {
    _id: ID
    items: [CartItem]
  }
  
  type CartItem {
    productId: ID!
    quantity: Int!
    size: String!
    price: Float!
    onModel: String!
  }  

  type Auth {
    token: ID!
    user: User
  }

  type SiteStats {
    totalVisitors: Int!
    monthlyVisitors: [MonthlyVisitorData!]!
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

  type GeneralStats {
    stats: SiteStats
    salesData: [SalesData!]!
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
    # User-related queries
    getUser(_id: ID!): User
    getAllUsers: [User!]!

    getSnowboard(id: ID!): Snowboard
    getAllSnowboards: [Snowboard!]!
    getApparel(id: ID!): Apparel
    getAllApparel: [Apparel!]!
    getCart: [CartItem]

    generalStats: GeneralStats!
    snowboardStats: SnowboardStats!
    apparelStats: ApparelStats!
    
    topApparelByViews(limit: Int): [Apparel]
    topSnowboardByViews(limit: Int): [Snowboard]
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): Auth
    logout: String!
    addToCart(productId: ID!, quantity: Int!, size: String!, type: String!): [CartItem]
    removeFromCart(productId: ID!): [CartItem]
    incrementApparelViews(_id: ID!): Apparel
    incrementSnowboardViews(_id: ID!): Snowboard
    
    createSnowboard(
      picture: [String!], 
      name: String!, 
      shape: String!, 
      sizes: [SnowboardSizeInput!]!, 
      flex: String!, 
      boardConstruction: String!, 
      price: Float!
      ): Snowboard!
      
      createApparel(
        pictures: [String!]!,
        name: String!,
        style: String!, 
        sizes: [ApparelSizeInput!]!, 
        price: Float!
        ): Apparel!
        
        updateSnowboard(id: ID!, input: [SnowboardSizeInput!]!): Snowboard
        updateApparel(id: ID!, input: [ApparelSizeInput!]!): Apparel

        deleteSnowboard(id: ID!): Snowboard
        deleteApparel(id: ID!): Apparel
      }


    input SnowboardSizeInput {
      size: String!
      inStock: Int!
    }

    input ApparelSizeInput {
      size: String!
      inStock: Int!
    }
`;

module.exports = typeDefs;
