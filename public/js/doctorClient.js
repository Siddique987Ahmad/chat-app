const socket = io();
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');

// Send message
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = messageInput.value;
        socket.emit('sendMessage', { text: message, senderRole: 'doctor' });
        messageInput.value = '';
    }
});

// Listen for new messages
socket.on('receiveMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.className = data.senderRole === 'doctor' ? 'doctor-message' : 'patient-message';
    messageElement.innerHTML = `<strong>${data.senderRole}:</strong> ${data.text} <small>${new Date(data.timestamp).toLocaleTimeString()}</small>`;
    messagesDiv.appendChild(messageElement);
});
