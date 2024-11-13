import ReactDOM from 'react-dom/client';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ApparelPage from './pages/ApparelPage.jsx';
import ApparelDetailPage from './pages/ApparelDetailPage.jsx';
import SnowboardsPage from './pages/SnowboardsPage.jsx';
import SnowboardDetailPage from './pages/SnowboardDetailPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Cart from './pages/CartPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/dashboard',
        element: <Dashboard />
      }, {
        path: '/apparel',
        element: <ApparelPage />
      }, {
        path: '/apparel/:id',
        element: <ApparelDetailPage />
      },{
        path: '/snowboards',
        element: <SnowboardsPage />
      }, {
        path: '/snowboard/:id',
        element: <SnowboardDetailPage />
      }, {
        path: '/contact',
        element: <ContactPage />
      }, {
        path: '/cart',
        element: <Cart />
      } 

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
