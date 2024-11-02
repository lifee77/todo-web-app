// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await loginUser(username, password);
        onLogin();  // Notify parent component (App.js) about login
    } catch (err) {
        console.error('Login error:', err);
        setError(err.response?.data?.message || 'Error logging in');
    }
  };

  const handleRegister = () => {
    navigate('/register');  // Navigate to the registration page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputStyle = {
    paddingRight: '40px',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ maxWidth: '200px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ position: 'relative', maxWidth: '200px' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer'
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <button type="submit">Login</button>
      <p>New user? <button type="button" onClick={handleRegister}>Register</button></p>
    </form>
  );
};

export default Login;
