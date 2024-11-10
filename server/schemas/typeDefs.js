const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
  }

  type Snowboard {
    _id: ID
    picture: String!
    name: String!
    shape: String!
    sizes: [String!]!
    flex: String!
    boardConstruction: String!
    price: Float!
    views: Int
  }

  type Apparel {
    _id: ID
    pictures: [String!]!
    name: String!
    style: String!
    size: String!
    price: Float!
    views: Int
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

    generalStats: GeneralStats!
    snowboardStats: SnowboardStats!
    apparelStats: ApparelStats!
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): Auth
    logout: String!

    createSnowboard(
      picture: String!, 
      name: String!, 
      shape: String!, 
      sizes: [String!]!, 
      flex: String!, 
      boardConstruction: String!, 
      price: Float!
    ): Snowboard!

    createApparel(
      pictures: [String!]!,
      name: String!,
      style: String!, 
      size: String!, 
      price: Float!
    ): Apparel!
  }
`;

module.exports = typeDefs;
