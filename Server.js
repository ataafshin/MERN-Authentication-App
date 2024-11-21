const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');  // Ensure this path is correct

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-auth-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const secret = 'your_jwt_secret';  // Secret key for JWT

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the MERN Authentication App');
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
    const user = new User({ username, password: hashedPassword });

    // Check size of the document
    if (JSON.stringify(user).length > 16 * 1024 * 1024) {
        return res.status(400).send('Document size exceeds the limit of 16MB');
    }

    await user.save();  // Save the user to the database
    res.send(user);  // Send the saved user object as the response
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');  // Check if user exists
    const isMatch = await bcrypt.compare(password, user.password);  // Compare passwords
    if (!isMatch) return res.status(401).send('Invalid credentials');  // Incorrect password
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });  // Generate JWT token
    res.send({ message: 'Login successful', token });  // Send response with token
});

// Profile Route
app.get('/profile', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');  // No token provided
    try {
        const decoded = jwt.verify(token, secret);  // Verify token
        const user = await User.findById(decoded.id).select('-password');  // Find user by ID, exclude password
        res.send(user);  // Send user profile
    } catch (error) {
        res.status(400).send('Invalid token');  // Invalid token
    }
});

// Start the server
const port = process.env.PORT || 3000;  // Set your desired port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
