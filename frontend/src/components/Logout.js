import React from 'react';
import { logoutUser } from '../services/api';

// Logout component handles user logout functionality
const Logout = ({ onLogout }) => {
  // Function to handle logout process
  const handleLogout = async () => {
    try {
      // Call logoutUser API to log out the user
      await logoutUser();
      onLogout();  // Notify parent component (App.js) about logout
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    // Button to trigger logout process
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;