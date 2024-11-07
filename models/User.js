const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    role: { type: String, enum: ['doctor', 'patient'], required: true },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
});

module.exports = mongoose.model('User', userSchema);
