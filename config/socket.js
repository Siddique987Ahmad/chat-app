const socketSetup = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a room based on user role and ID (doctor or patient)
        socket.on('joinRoom', ({ userId, role }) => {
            socket.join(userId);  // Each user joins their own room by ID
            socket.role = role;    // Store the role on the socket object for reference
            console.log(`${role} with ID ${userId} joined their room`);
        });

        // Listen for messages from doctor or patient
        socket.on('sendMessage', (message) => {
            const timestamp = new Date();
            const { text, sender, senderRole, receiver } = message;

            // Emit the message only to the intended receiver
            io.to(receiver).emit('receiveMessage', { text, sender, senderRole, timestamp });
            console.log(`Message from ${senderRole} (${sender}) to ${receiver}: ${text}`);
        });

        // Handle typing status for doctor and patient
        socket.on('typing', ({ isTyping, senderRole, receiver }) => {
            // Notify only the intended recipient about the typing status
            io.to(receiver).emit('userTyping', { isTyping, senderRole });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = socketSetup;

