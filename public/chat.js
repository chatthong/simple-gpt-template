
async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  const imageInput = document.getElementById('image-input').files[0];

  if (!userInput && !imageInput) return;

  if (userInput) {
    displayMessage(userInput, 'user-message');
  }

  if (imageInput) {
    const reader = new FileReader();
    reader.onload = function(e) {
      displayImage(e.target.result, 'user-message');
    };
    reader.readAsDataURL(imageInput);
  }

  document.getElementById('user-input').value = '';
  document.getElementById('image-input').value = '';

  const formData = new FormData();
  formData.append('message', userInput);
  if (imageInput) {
    formData.append('image', imageInput);
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    body: formData
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

function displayImage(imageSrc, className) {
  const chatContainer = document.getElementById('chat-container');
  const imageElement = document.createElement('img');
  imageElement.className = `chat-message ${className}`;
  imageElement.src = imageSrc;
  chatContainer.appendChild(imageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
