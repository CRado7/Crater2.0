import { gql } from '@apollo/client';

// Mutation to create a new user
export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      _id
      username
    }
  }
`;

// Mutation to login a user
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to logout a user
export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

// Mutation to create a new snowboard with the `SnowboardSizeInput` input type
export const CREATE_SNOWBOARD = gql`
  mutation CreateSnowboard(
    $picture: [String!],
    $name: String!,
    $shape: String!,
    $sizes: [SnowboardSizeInput!]!,
    $flex: String!,
    $boardConstruction: String!,
    $price: Float!
  ) {
    createSnowboard(
      picture: $picture,
      name: $name,
      shape: $shape,
      sizes: $sizes,
      flex: $flex,
      boardConstruction: $boardConstruction,
      price: $price
    ) {
      _id
      picture
      name
      shape
      sizes {
        size
        inStock
      }
      flex
      boardConstruction
      price
    }
  }
`;

// Mutation to create a new apparel item with the `ApparelSizeInput` input type
export const CREATE_APPAREL = gql`
  mutation CreateApparel(
    $pictures: [String!]!,
    $name: String!,
    $style: String!,
    $sizes: [ApparelSizeInput!]!,
    $price: Float!
  ) {
    createApparel(
      pictures: $pictures,
      name: $name,
      style: $style,
      sizes: $sizes,
      price: $price
    ) {
      _id
      pictures
      name
      style
      sizes {
        size
        inStock
      }
      price
    }
  }
`;

// Mutation to update a snowboard
export const UPDATE_SNOWBOARD = gql`
  mutation UpdateSnowboard($id: ID!, $input: [SnowboardSizeInput!]!) {
    updateSnowboard(id: $id, input: $input) {
      _id
      picture
      name
      shape
      sizes {
        size
        inStock
      }
      flex
      boardConstruction
      price
    }
  }
`;

// Mutation to update an apparel item
export const UPDATE_APPAREL = gql`
  mutation UpdateApparel($id: ID!, $input: [ApparelSizeInput!]!) {
    updateApparel(id: $id, input: $input) {
      _id
      pictures
      name
      style
      sizes {
        size
        inStock
      }
      price
    }
  }
`;

export const DELETE_SNOWBOARD = gql`
  mutation DeleteSnowboard($id: ID!) {
    deleteSnowboard(id: $id) {
      _id
      name
      picture
    }
  }
`;

export const DELETE_APPAREL = gql`
  mutation DeleteApparel($id: ID!) {
    deleteApparel(id: $id) {
      _id
      name
      pictures
    }
  }
`;

