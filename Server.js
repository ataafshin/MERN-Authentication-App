const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/your-db', { useNewUrlParser: true, useUnifiedTopology: true });

const secret = 'your_jwt_secret';

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.send(user);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.send({ message: 'Login successful', token });
});

app.get('/profile', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('-password');
        res.send(user);
    } catch (error) {
        res.status(400).send('Invalid token');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
