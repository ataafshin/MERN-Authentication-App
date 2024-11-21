import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const register = async () => {
        try {
            const response = await axios.post('http://localhost:3000/register', { username, password });
            setMessage('Registration successful! You can now log in.');
            console.log(response.data);
        } catch (error) {
            setMessage('Error during registration. Please try again.');
            console.error(error);
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            setToken(response.data.token);
            setMessage('Login successful!');
            console.log(response.data);
        } catch (error) {
            setMessage('Invalid username or password. Please try again.');
            console.error(error);
        }
    };

    const getProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile fetched successfully!');
            console.log(response.data);
        } catch (error) {
            setMessage('Error fetching profile. Please log in again.');
            console.error(error);
        }
    };

    return (
        <div className="container">
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
            <div className="buttons">
                <button onClick={register}>Register</button>
                <button onClick={login}>Login</button>
                <button onClick={getProfile}>Get Profile</button>
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default App;
