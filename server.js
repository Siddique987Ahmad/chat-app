// const express = require('express');
// const http = require('http');
// const db=require('./config/db')
// const socketSetup=require('./config/socket')
// const { Server } = require('socket.io');
// const path = require('path');
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// socketSetup(io)
// const PORT = 3000;
// db()
// // Set up EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Route to serve the chat interface
// app.get('/chat', (req, res) => {
//     res.render('chat');  // This will render views/chat.ejs
// });
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//     res.send('Server is running...');
// });

// // io.on('connection', (socket) => {
// //     console.log('A user connected:', socket.id);

// //     // Listen for new messages
// //     socket.on('sendMessage', (message) => {
// //         const timestamp = new Date();
// //         io.emit('receiveMessage', { ...message, timestamp }); // Broadcast the message to all users
// //     });

// //     // Listen for typing indicator
// //     socket.on('typing', (isTyping) => {
// //         socket.broadcast.emit('userTyping', { userId: socket.id, isTyping });
// //     });

// //     // Handle disconnection
// //     socket.on('disconnect', () => {
// //         console.log('User disconnected:', socket.id);
// //     });
// // });

// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const http = require('http');
const db = require('./config/db');
const socketSetup = require('./config/socket');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.IO setup
socketSetup(io);

// Initialize database connection
db();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the chat interface
app.get('/chat', (req, res) => {
    // Fetch messages from the database
    const Message = require('./models/Message');
    Message.find().lean()
        .then(messages => {
            res.render('chat', { messages });  // Render the chat page with messages
        })
        .catch(err => {
            console.error('Error fetching messages:', err);
            res.status(500).send('An error occurred while loading the chat');
        });
});

// Route to send a message
app.use('/chat', require('./routes/chatRoutes'));  // Include the chatRoutes file for message sending
app.use('/user',require('./routes/userRoutes'))
// Route for the home page
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Start the server
server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
