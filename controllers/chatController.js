// const Message = require('../models/Message');

// const sendMessage = async (req, res) => {
//     const { text, sender, receiver } = req.body;

//     const message = new Message({ text, sender, receiver });
//     await message.save();
//     io.to(receiver).emit('receiveMessage', {
//         text: message.text,
//         sender: message.sender,
//         senderRole: message.senderRole,
//         timestamp: message.timestamp
//     });

//     res.status(200).json({ message: 'Message sent successfully', data: message });
// };

// module.exports = { sendMessage };
const Message = require('../models/Message');

const sendMessage = async (req, res, io) => {
    const { text, sender, receiver, senderRole } = req.body;

    // Create a new message with the data
    const message = new Message({ text, sender, receiver, senderRole });
    
    try {
        // Save the message to the database
        await message.save();

        // Emit the message to the receiver through Socket.IO
        io.to(receiver).emit('receiveMessage', {
            text: message.text,
            sender: message.sender,
            senderRole: message.senderRole,
            timestamp: message.timestamp,
        });

        // Send a response back to the sender
        res.status(200).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

module.exports = { sendMessage };

