const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  // Unique username
    password: { type: String, required: true },  // Password
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
