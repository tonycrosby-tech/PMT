import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory

export default function Profile({ logout }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null); // Store username if needed
  const history = useHistory(); // Get history object

  const getUser = () => {
    axios.get('/api/auth/user').then((response) => {
      if (response.data.user) {
        setLoggedIn(true);
        setUsername(response.data.user.username);
        console.log(response.data.user.username);
        fetchSubscriptions();
      } else {
        setLoggedIn(false);
        setUsername(null);
      }
    });
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/subscriptions'); // Endpoint to fetch Subscriptions
      setSubscriptions(response.data.subscriptions);
    } catch (error) {
      console.error('Failed to fetch Subscriptions:', error);
    }
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col my-12 mx-4 w-full max-w-lg">
          <div className="flex shadow-2xl rounded-3xl justify-center flex-col py-12 items-center text-xl bg-white">
            <h1 className="text-3xl font-bold text-black mb-4">Dashboard</h1>
            <div className="flex flex-col items-center">
              {loggedIn ? (
                <>
                  <p className="text-gray-800 text-xl mb-4">
                    Welcome, {username}!
                  </p>
                  <button
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mb-4"
                    onClick={logOut}
                  >
                    Logout
                  </button>

                  <h2 className="text-xl font-bold mb-2">Your subscriptions</h2>
                  <div className="w-full">
                    {subscriptions.length > 0 ? (
                      subscriptions.map((project) => (
                        <div
                          key={project._id}
                          className="bg-gray-200 p-4 mb-2 rounded-lg"
                        >
                          <h3 className="font-semibold">{project.name}</h3>
                          <p>{project.description}</p>
                          {/* Add a button to view tasks or edit project */}
                          <button className="mt-2 bg-blue-500 text-white rounded-md px-2 py-1">
                            View Tasks
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No subscriptions found.</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-600">
                  Please log in to access your account.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
