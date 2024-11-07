const socket = io();

const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = messageInput.value;
        socket.emit('sendMessage', { text: message });
        messageInput.value = '';
    }
});

messageInput.addEventListener('input', () => {
    socket.emit('typing', messageInput.value.length > 0);
});

socket.on('receiveMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.text} - ${new Date(data.timestamp).toLocaleTimeString()}`;
    messagesDiv.appendChild(messageElement);
});

socket.on('userTyping', (data) => {
    typingIndicator.textContent = data.isTyping ? 'A user is typing...' : '';
});
