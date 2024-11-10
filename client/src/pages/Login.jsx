import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';  // Import the login mutation
import AuthService from '../utils/auth';

console.log("Login mutation:", LOGIN);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Use the login mutation
  const [login, { error, data }] = useMutation(LOGIN);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log("Starting handleLogin");  // Logs start of function
    console.log("Username:", username);
    console.log("Password:", password);
  
    try {
      const { data } = await login({
        variables: { username, password },
      });
      
      console.log('Login mutation response data:', data);  // Logs after mutation is called
  
      if (data?.login?.token) {
        console.log('Token received:', data.login.token);
        AuthService.login(data.login.token);
        navigate('/dashboard');
      } else {
        console.warn('No token returned from login mutation');
      }
    } catch (err) {
      console.error('Error during login mutation:', err);  // Logs error details
      if (err.networkError) {
        console.error('Network error details:', err.networkError);
      }
      if (err.graphQLErrors) {
        console.error('GraphQL error details:', err.graphQLErrors);
      }
      alert('Login failed: Please check your credentials or try again later.');
    }
  };
  

  return (
    <form onSubmit={handleLogin}>
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
      {error && <p>Error logging in: {error.message}</p>}
    </form>
  );
};

export default Login;
