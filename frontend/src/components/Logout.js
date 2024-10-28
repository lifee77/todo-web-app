import React from 'react';
import { logoutUser } from '../services/api';

const Logout = ({ onLogout }) => {
    const handleLogout = async () => {
        try {
            await logoutUser();
            onLogout();
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;