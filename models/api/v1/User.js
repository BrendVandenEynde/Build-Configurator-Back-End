const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the User model
const User = mongoose.model('User', UserSchema);

// Export the model
module.exports = User;
