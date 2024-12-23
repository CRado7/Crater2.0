// queries.js
import { gql } from '@apollo/client';

// Query to get a single user by ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      _id
      username
    }
  }
`;

// Query to get all users
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
    }
  }
`;

// Query to get a single snowboard by ID
export const GET_SNOWBOARD = gql`
  query GetSnowboard($id: ID!) {
    getSnowboard(id: $id) {
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
    }
  }
`;

// Query to get all snowboards
export const GET_ALL_SNOWBOARDS = gql`
  query GetAllSnowboards {
    getAllSnowboards {
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


// Query to get a single apparel item by ID
export const GET_APPAREL = gql`
  query GetApparel($id: ID!) {
    getApparel(id: $id) {
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

// Query to get all apparel items
export const GET_ALL_APPAREL = gql`
  query getAllApparel {
    getAllApparel {
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

export const GET_FEATURED_SNOWBOARDS = gql`
  query GetFeaturedSnowboards {
    getFeaturedSnowboards {
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

export const GET_FEATURED_APPAREL = gql`
  query GetFeaturedApparel {
    getFeaturedApparel {
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

export const GET_SITE_STATS = gql`
  query GetSiteStats {
    getSiteStats {
      totalViews
      uniqueVisits
      monthlyStats {
        year
        month
        totalViews
        uniqueVisits
      }
    }
  }
`;

export const GET_MONTHLY_STATS = gql`
  query GetMonthlyStats {
    getSiteStats {
      monthlyStats {
        year
        month
        totalViews
        uniqueVisits
      }
    }
  }
`;

export const GET_SNOWBOARD_STATS = gql`
  query GetSnowboardStats {
    snowboardStats {
      mostViewedBoard {
        name
        views
      }
    }
  }
`;

export const GET_APPAREL_STATS = gql`
  query GetApparelStats {
    apparelStats {
      mostViewedApparel {
        name
        views
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    getCart {
      sessionId
      items {
        productId
        quantity
        name
        size
        type
        picture
        price
      }
    }
  }
`;


export const GET_TOP_APPAREL = gql`
  query TopApparelByViews($limit: Int) {
    topApparelByViews(limit: $limit) {
      _id
      name
      views
      pictures
      price
      featured
    }
  }
`;

export const GET_TOP_SNOWBOARD = gql`
  query TopSnowboardByViews($limit: Int) {
    topSnowboardByViews(limit: $limit) {
      _id
      name
      views
      pictures
      price
      featured
    }
  }
`;

