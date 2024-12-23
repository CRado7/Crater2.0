import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../utils/mutations'; // Import the login mutation
import AuthService from '../utils/auth';

import '../styles/Login.css'; // Ensure your styles are imported

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for styled error message
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      const { data } = await login({
        variables: { username, password },
      });

      if (data?.login?.token) {
        AuthService.login(data.login.token);
        navigate('/dashboard');
      } else {
        setErrorMessage('No token returned from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.graphQLErrors?.length) {
        setErrorMessage(err.graphQLErrors[0].message);
      } else if (err.networkError) {
        setErrorMessage('Network error: Please check your connection.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default Login;
