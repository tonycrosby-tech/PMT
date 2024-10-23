import React, { Component } from 'react';
import axios from 'axios';


class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      email: '',
      message: ''
    };
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { email, username, password } = this.state;

    axios
      .post('/api/auth/register', {
        email,
        username,
        password,
      })
      .then((result) => {
        this.props.history.push('/login');
      });
  };

  render() {
    const { email, username, password, message } = this.state;
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            {message && (
              <p className="text-red-500 text-center mb-4">{message}</p>
            )}
            <form onSubmit={this.onSubmit}>
              <div className="mb-4">
                <input
                  required
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={username}
                  autoComplete="username"
                  autoFocus
                  onChange={this.onChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  required
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  autoComplete="email"
                  onChange={this.onChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  required
                  name="password"
                  placeholder="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={this.onChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-center mb-4">
                <a href="/login" className="text-blue-600 hover:underline">
                  Already have an Account? Sign In
                </a>
              </div>
              <button
                type="submit"
                onClick={this.onSubmit}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Signup;
