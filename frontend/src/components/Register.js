import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

// Register component handles user registration
const Register = ({ onRegister }) => {
  // State variables for username, password, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call registerUser API to register the user
      await registerUser(username, password);
      onRegister(); // Notify parent component (App.js) about registration
      navigate('/'); // Redirect to the main page after registration
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {/* Display error message if registration fails */}
      {error && <p>{error}</p>}
      {/* Username input field */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {/* Password input field */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* Submit button */}
      <button type="submit">Register</button>
      {/* Link to login page for existing users */}
      <p>
        Already have an account? <button type="button" onClick={() => navigate('/login')}>Login</button>
      </p>
    </form>
  );
};

export default Register;