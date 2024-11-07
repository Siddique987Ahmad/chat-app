// const socketSetup = (io) => {
//     io.on('connection', (socket) => {
//         console.log('User connected:', socket.id);

//         socket.on('sendMessage', (message) => {
//             const timestamp = new Date();
//             io.emit('receiveMessage', { ...message, timestamp });
//         });

//         socket.on('typing', (isTyping) => {
//             socket.broadcast.emit('userTyping', { userId: socket.id, isTyping });
//         });

//         socket.on('disconnect', () => {
//             console.log('User disconnected:', socket.id);
//         });
//     });
// };

// module.exports = socketSetup;

const socketSetup = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join the user to a room based on their ID
        socket.on('joinRoom', ({ userId, role }) => {
            socket.join(userId);
            console.log(`User with ID: ${userId} and role: ${role} joined room ${userId}`);
        });

        // Handle incoming messages
        socket.on('sendMessage', (message) => {
            const { text, sender, receiver, senderRole } = message;

            // Emit the message to only the intended receiver
            io.to(receiver).emit('receiveMessage', {
                text,
                sender,
                senderRole,
                timestamp: new Date(),
            });

            console.log(`Message from ${senderRole} (${sender}) to user ${receiver}: ${text}`);
        });

        // Typing indicator
        socket.on('typing', ({ sender, receiver, isTyping }) => {
            io.to(receiver).emit('userTyping', {
                sender,
                isTyping,
            });
            console.log(`${sender} is ${isTyping ? 'typing...' : 'not typing'}`);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = socketSetup;
