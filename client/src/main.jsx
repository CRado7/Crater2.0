import ReactDOM from 'react-dom/client';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import ApparelPage from './pages/ApparelPage.jsx';
import SnowboardsPage from './pages/SnowboardsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Dashboard from './pages/Dashboard.jsx';


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
        path: '/apparel',
        element: <ApparelPage />
      }, {
        path: '/snowboards',
        element: <SnowboardsPage />
      }, {
        path: '/contact',
        element: <ContactPage />
      }, {
        path: '/dashboard',
        element: <Dashboard />
      } 

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
