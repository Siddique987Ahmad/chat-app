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
// app.get('/chat', (req, res) => {
//     // Fetch messages from the database
//     const Message = require('./models/Message');
//     Message.find().lean()
//         .then(messages => {
//             res.render('chat', { messages });  // Render the chat page with messages
//         })
//         .catch(err => {
//             console.error('Error fetching messages:', err);
//             res.status(500).send('An error occurred while loading the chat');
//         });
// });
// // Routes to serve doctor and patient chat interfaces
// app.get('/doctor-chat', (req, res) => {
//     const Message = require('./models/Message');
//     Message.find({ senderRole: 'doctor' }).lean()
//         .then(messages => {
//             res.render('doctorChat', { messages }); // Renders views/doctorChat.ejs
//         })
//         .catch(err => {
//             console.error('Error loading doctor chat:', err);
//             res.status(500).send('Error loading doctor chat');
//         });
// });

// app.get('/patient-chat', (req, res) => {
//     const Message = require('./models/Message');
//     Message.find({ senderRole: 'patient' }).lean()
//         .then(messages => {
//             res.render('patientChat', { messages }); // Renders views/patientChat.ejs
//         })
//         .catch(err => {
//             console.error('Error loading patient chat:', err);
//             res.status(500).send('Error loading patient chat');
//         });
// });


// Route to send a message

// Route to serve the chat interface
app.get('/chat', (req, res) => {
    // Fetch messages from the database and set senderRole
    const Message = require('./models/Message');
    Message.find().lean()
        .then(messages => {
            // Set senderRole based on the session or user type (adjust as necessary)
            const senderRole = req.user && req.user.role === 'doctor' ? 'doctor' : 'patient';
            res.render('chat', { messages, senderRole });  // Pass senderRole dynamically
        })
        .catch(err => {
            console.error('Error fetching messages:', err);
            res.status(500).send('An error occurred while loading the chat');
        });
});

// Routes to serve doctor and patient chat interfaces
app.get('/doctor-chat', (req, res) => {
    const Message = require('./models/Message');
    Message.find({ senderRole: 'doctor' }).lean()
        .then(messages => {
            res.render('doctorChat', { messages, senderRole: 'doctor' });  // Set senderRole to 'doctor'
        })
        .catch(err => {
            console.error('Error loading doctor chat:', err);
            res.status(500).send('Error loading doctor chat');
        });
});

app.get('/patient-chat', (req, res) => {
    const Message = require('./models/Message');
    Message.find({ senderRole: 'patient' }).lean()
        .then(messages => {
            res.render('patientChat', { messages, senderRole: 'patient' });  // Set senderRole to 'patient'
        })
        .catch(err => {
            console.error('Error loading patient chat:', err);
            res.status(500).send('Error loading patient chat');
        });
});


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
