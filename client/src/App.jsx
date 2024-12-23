import './App.css';
import React from 'react';

import Nav from './components/Nav';
import Footer from './components/Footer'
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

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Make sure the URL is correct
  credentials: 'include',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  const sessionId = Cookies.get('sessionId');
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      'session-id': sessionId || '',
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
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
