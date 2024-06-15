document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('send-button').addEventListener('click', sendMessage);
});

async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  const imageUrl = document.getElementById('image-url').value;

  if (!userInput && !imageUrl) return;

  if (userInput) {
    displayMessage(userInput, 'user-message');
  }

  if (imageUrl) {
    displayMessage(imageUrl, 'user-message');
  }

  document.getElementById('user-input').value = '';
  document.getElementById('image-url').value = '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userInput, imageUrl: imageUrl }),
  });

  const data = await response.json();
  displayMessage(data.reply, 'bot-message');
}

function displayMessage(message, className) {
  const chatContainer = document.getElementById('chat-container');
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${className}`;
  messageElement.textContent = message;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
