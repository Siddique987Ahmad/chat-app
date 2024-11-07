const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    text: String,
    sender: String,
    receiver: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
