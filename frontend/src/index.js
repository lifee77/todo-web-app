// index.js
// This is the entry point of the React application.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing
import './index.css'; // Import global CSS styles
import App from './App'; // Import the main App component

// Create a root element for rendering the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application within the root element
root.render(
  <React.StrictMode>
    {/* Wrap the App component with BrowserRouter to enable routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);