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
    $pictures: [String!],
    $name: String!,
    $shape: String!,
    $sizes: [SnowboardSizeInput!]!,
    $flex: String!,
    $boardConstruction: String!,
    $price: Float!,
    $featured: Boolean
  ) {
    createSnowboard(
      pictures: $pictures,
      name: $name,
      shape: $shape,
      sizes: $sizes,
      flex: $flex,
      boardConstruction: $boardConstruction,
      price: $price,
      featured: $featured
    ) {
      _id
      pictures
      name
      shape
      sizes {
        size
        inStock
      }
      flex
      boardConstruction
      price
      featured
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
    $price: Float!,
    $featured: Boolean!
  ) {
    createApparel(
      pictures: $pictures,
      name: $name,
      style: $style,
      sizes: $sizes,
      price: $price,
      featured: $featured
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
      featured
    }
  }
`;

// Mutation to update a snowboard
export const UPDATE_SNOWBOARD = gql`
  mutation UpdateSnowboard($id: ID!, $input: [SnowboardSizeInput!]!, $featured: Boolean) {
    updateSnowboard(id: $id, input: $input, featured: $featured) {
      _id
      pictures
      name
      shape
      sizes {
        size
        inStock
      }
      flex
      boardConstruction
      price
      featured
    }
  }
`;

// Mutation to update an apparel item
export const UPDATE_APPAREL = gql`
  mutation UpdateApparel($id: ID!, $input: [ApparelSizeInput!]!, $featured: Boolean) {
    updateApparel(id: $id, input: $input, featured: $featured) {
      _id
      pictures
      name
      style
      sizes {
        size
        inStock
      }
      price
      featured
    }
  }
`;

export const DELETE_SNOWBOARD = gql`
  mutation DeleteSnowboard($id: ID!) {
    deleteSnowboard(id: $id) {
      _id
      name
      pictures
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

export const INCREMENT_APPAREL_VIEWS = gql`
  mutation IncrementApparelViews($id: ID!) {
    incrementApparelViews(_id: $id) {
      name
      views
    }
  }
`;

export const INCREMENT_SNOWBOARD_VIEWS = gql`
  mutation IncrementSnowboardViews($id: ID!) {
    incrementSnowboardViews(_id: $id) {
      name
      views
    }
  }
`;

export const INCREMENT_SITE_STATS = gql`
  mutation IncrementSiteStats {
    incrementSiteStats {
      totalViews
      uniqueVisits
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      sessionId
      items {
        productId
        quantity
        name
        size
        type
        price
        picture
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input) {
      id
      sessionId
      items {
        productId
        quantity
      }
    }
  }
`;

export const UPDATE_CART_QUANTITY = gql`
  mutation UpdateCartQuantity($input: UpdateCartQuantityInput!) {
    updateCartQuantity(input: $input) {
      id
      sessionId
      items {
        productId
        quantity
      }
    }
  }
`;






