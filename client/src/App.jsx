import './App.css';
import React from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SiteStatsIncrementer from './components/SiteStatsIncrementer';
import { Outlet } from 'react-router-dom';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

// Ensure the backend URL and CORS setup match correctly
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include',  // ✅ Ensures cookies are sent with the request
});

// ✅ Attaches both the sessionId and auth token properly
const authLink = setContext((_, { headers }) => {
  const sessionId = Cookies.get('sessionId'); 
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      'sessionId': sessionId || '',  // Ensure this matches backend expectations
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// ✅ Apply the link properly in order
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include',  // ✅ Ensures cookies are sent with the request
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Nav />
      <SiteStatsIncrementer />
      <Outlet />
      <Footer />
    </ApolloProvider>
  );
}

export default App;
