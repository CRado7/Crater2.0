
import { useRouteError } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react';
// import '../styles/ErrorPage.css';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
      <div className="not-found">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>It looks like you went a little far beyond.</p>
          <p>Thats great when your shredding but you should head back to our known areas of the site.</p>
          <Link to="/" className="home-link">Go Home</Link>
      </div>
);
}