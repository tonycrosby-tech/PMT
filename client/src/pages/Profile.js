import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory


export default function Profile() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null); // Store username if needed
  const history = useHistory(); // Get history object

  const getUser = () => {
    axios.get('/api/auth/user').then((response) => {
      if (response.data.user) {
        setLoggedIn(true);
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
        console.log(response.data.user.username);
      } else {
        setLoggedIn(null);
        setUsername(null);
        setEmail(null);
      }
    });
  };
  const logOut = async () => {
    try {
      await axios.get('/api/auth/logout'); // Call the logout endpoint
      localStorage.removeItem('token'); // Remove the token from local storage
      setLoggedIn(false);
      setUsername(null);
      history.push('/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // No need for [10000000], just use []

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col my-12 mx-4 w-full max-w-lg">
          <div className="flex shadow-2xl rounded-3xl flex-col py-12 items-center bg-white">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {/* Placeholder for profile picture */}
                <span className="text-4xl text-white font-bold">
                  {username}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              {username}
            </h1>
            <h2 className="text-xl text-gray-600 mb-4">{email}</h2>
            <h3>
              <a href="/home">HOME</a>
            </h3>
            <div className="bg-slate-400 my-4 mx-4 p-6 rounded-lg shadow-md w-full">
              <h2 className="text-xl font-semibold text-center text-white mb-2">
                User Information
              </h2>
              <p className="text-white">
                Username: <span className="font-medium">{username}</span>
              </p>
              <p className="text-white">
                Email: <span className="font-medium">{email}</span>
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={logOut}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
