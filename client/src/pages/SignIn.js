import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const history = useHistory();

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        history.push('/home'); // Redirect to home
      } else {
        setMessage('Login failed. Please try again.');
      }
    } catch (error) {
      setMessage('Login failed. Username or password do not match.');
      console.error(
        'Login error:',
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              required
              name="username"
              placeholder="Username"
              value={username}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              required
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              autoComplete="current-password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
          <div className="text-center mt-4">
            <a href="/" className="text-blue-600 hover:underline">
              Don't Have an Account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
