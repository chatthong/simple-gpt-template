document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('send-button').addEventListener('click', sendMessage);
  if (!window.conversations) {
    window.conversations = {
      Chat1: []
    };
  }
});

async function sendMessage(tabId) {
  const userInput = document.getElementById(`user-input-${tabId}`).value;
  const imageInput = document.getElementById(`image-input-${tabId}`).files[0];

  if (!userInput && !imageInput) return;

  if (userInput) {
    displayMessage(tabId, userInput, 'user-message');
    window.conversations[tabId].push({
      role: 'user',
      content: [
        {
          type: "text",
          text: userInput
        }
      ]
    });
  }

  if (imageInput) {
    const reader = new FileReader();
    reader.onload = function(e) {
      displayImage(tabId, e.target.result, 'user-message');
    };
    reader.readAsDataURL(imageInput);
  }

  document.getElementById(`user-input-${tabId}`).value = '';
  document.getElementById(`image-input-${tabId}`).value = '';

  const formData = new FormData();
  formData.append('conversation', JSON.stringify(window.conversations[tabId]));
  if (imageInput) {
    formData.append('image', imageInput);
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  displayMessage(tabId, data.reply, 'bot-message');
  window.conversations[tabId].push({
    role: 'assistant',
    content: [
      {
        type: "text",
        text: data.reply
      }
    ]
  });
}

function displayMessage(tabId, message, className) {
  const chatContainer = document.getElementById(`messages-${tabId}`);
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${className}`;
  messageElement.textContent = message;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayImage(tabId, imageSrc, className) {
  const chatContainer = document.getElementById(`messages-${tabId}`);
  const imageElement = document.createElement('img');
  imageElement.className = `chat-message ${className}`;
  imageElement.src = imageSrc;
  chatContainer.appendChild(imageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

let tabCount = 1;

function addTab() {
  tabCount++;
  const tabId = `Chat${tabCount}`;

  const newTabButton = document.createElement('button');
  newTabButton.className = 'tablinks';
  newTabButton.textContent = `Chat ${tabCount}`;
  newTabButton.onclick = function(event) {
    openTab(event, tabId);
  };

  const tabs = document.getElementById('tabs');
  tabs.insertBefore(newTabButton, tabs.lastElementChild);

  const newTabContent = document.createElement('div');
  newTabContent.id = tabId;
  newTabContent.className = 'tabcontent';
  newTabContent.innerHTML = `
    <div id="chat-container-${tabId}" class="chat-container">
        <input type="text" id="user-input-${tabId}" placeholder="Type your message here">
        <input type="file" id="image-input-${tabId}" accept="image/*">
        <button onclick="sendMessage('${tabId}')">Send</button>
        <div id="messages-${tabId}"></div>
    </div>
  `;

  document.body.appendChild(newTabContent);
  newTabButton.click();

  if (!window.conversations) {
    window.conversations = {};
  }
  window.conversations[tabId] = [];
}
