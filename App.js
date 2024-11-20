import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    // Function to handle user registration
    const register = async () => {
        const response = await axios.post('http://localhost:3000/register', { username, password });
        console.log(response.data);  // Log the registered user data
    };

    // Function to handle user login
    const login = async () => {
        const response = await axios.post('http://localhost:3000/login', { username, password });
        setToken(response.data.token);  // Store the JWT token
        console.log(response.data);  // Log the login response
    };

    // Function to fetch user profile
    const getProfile = async () => {
        const response = await axios.get('http://localhost:3000/profile', {
            headers: { Authorization: token }  // Set the Authorization header
        });
        console.log(response.data);  // Log the user profile data
    };

    return (
        <div>
            <h1>User Authentication</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
            <button onClick={getProfile}>Get Profile</button>
        </div>
    );
};

export default App;
