document.addEventListener('DOMContentLoaded', function() {
    openTab('Chat1');
    if (!window.conversations) {
        window.conversations = {
            Chat1: []
        };
    }

    // Fetch and set predefined avatars for each chat
    setAvatar('Chat1');
});

function openTab(tabId) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    document.getElementById(tabId).classList.add('active');
}

let tabCount = 1;

function addTab() {
    tabCount++;
    const tabId = `Chat${tabCount}`;

    const newTabButton = document.createElement('li');
    newTabButton.className = 'chat-item';
    newTabButton.onclick = function() {
        openTab(tabId);
    };
    newTabButton.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="ml-3">
                <h6 class="mb-0">Chat #${tabCount}</h6>
                <small>Last message preview...</small>
            </div>
        </div>
    `;

    const tabs = document.getElementById('chatTabs');
    tabs.appendChild(newTabButton);

    const newTabContent = document.createElement('div');
    newTabContent.id = tabId;
    newTabContent.className = 'tabcontent';
    newTabContent.innerHTML = `
        <div class="p-3">
            <h5>Chat #${tabCount}</h5>
            <div class="chat-content" id="messages-${tabId}"></div>
            <div class="input-group mt-3">
                <input type="text" class="form-control" id="user-input-${tabId}" placeholder="Type something...">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" onclick="document.getElementById('image-input-${tabId}').click()">Upload</button>
                    <input type="file" id="image-input-${tabId}" accept="image/*" style="display: none;" onchange="handleImageChange('${tabId}')">
                    <button class="btn btn-primary" onclick="sendMessage('${tabId}')" type="button">Send</button>
                </div>
            </div>
        </div>
    `;

    document.querySelector('.chat-window').appendChild(newTabContent);
    openTab(tabId);

    if (!window.conversations) {
        window.conversations = {};
    }
    window.conversations[tabId] = [];

    // Fetch and set predefined avatars for the new chat tab
    setAvatar(tabId);
}

function handleImageChange(tabId) {
    const imageInput = document.getElementById(`image-input-${tabId}`);
    if (imageInput.files.length > 0) {
        // Image selected
    } else {
        // Image cleared
    }
}

// Existing function to send messages
function sendMessage(chatId) {
    const userInput = document.getElementById(`user-input-${chatId}`);
    const messageContent = userInput.value;
    if (messageContent.trim() !== '') {
        const messageContainer = document.getElementById(`messages-${chatId}`);

        // Add user message to chat
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerHTML = `<p>${messageContent}</p>`;
        messageContainer.appendChild(userMessage);

        // Clear the input
        userInput.value = '';

        // Update last message preview
        updateLastMessagePreview(chatId, messageContent);

        // Scroll to the bottom of the chat
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // Simulate bot response after a delay
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot-message';
            botMessage.innerHTML = `<p>This is a bot response</p>`;
            messageContainer.appendChild(botMessage);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 1000);
    }
}

// Function to update last message preview
function updateLastMessagePreview(chatId, message) {
    const chatItem = document.querySelector(`li[onclick="openTab('${chatId}')"] small`);
    chatItem.textContent = message;
}

// Function to close chat
function closeChat(chatId) {
    const chatTab = document.getElementById(chatId);
    chatTab.remove();
    const chatListItem = document.querySelector(`li[onclick="openTab('${chatId}')"]`);
    chatListItem.remove();
    // Optionally, switch to another tab if needed
}

// Function to open a chat tab
function openTab(chatId) {
    const tabcontents = document.querySelectorAll('.tabcontent');
    tabcontents.forEach(tabcontent => {
        tabcontent.classList.remove('active');
    });
    document.getElementById(chatId).classList.add('active');
}

// Add event listener to chat item for closing chat
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-chat')) {
            const chatId = e.target.parentElement.getAttribute('onclick').match(/'([^']+)'/)[1];
            closeChat(chatId);
        } else {
            const chatId = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
            openTab(chatId);
        }
    });
});

// Function to add a new chat tab
function addTab() {
    const chatList = document.getElementById('chatTabs');
    const newChatId = `Chat${chatList.children.length + 1}`;

    const chatItem = document.createElement('li');
    chatItem.className = 'chat-item';
    chatItem.setAttribute('onclick', `openTab('${newChatId}')`);
    chatItem.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="ml-3">
                <h6 class="mb-0">${newChatId}</h6>
                <small>Last message preview...</small>
            </div>
            <button class="btn btn-danger btn-sm close-chat">X</button>
        </div>
    `;
    chatList.appendChild(chatItem);

    const chatWindow = document.createElement('div');
    chatWindow.className = 'p-3 tabcontent';
    chatWindow.id = newChatId;
    chatWindow.innerHTML = `
        <h5>${newChatId}</h5>
        <div class="chat-content" id="messages-${newChatId}"></div>
        <div class="input-group mt-3">
            <input type="text" class="form-control" id="user-input-${newChatId}" placeholder="Type something...">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" onclick="document.getElementById('image-input-${newChatId}').click()">Upload</button>
                <input type="file" id="image-input-${newChatId}" accept="image/*" style="display: none;">
                <button class="btn btn-primary" onclick="sendMessage('${newChatId}')" type="button">Send</button>
            </div>
        </div>
    `;
    document.querySelector('.chat-window').appendChild(chatWindow);
}


async function setAvatar(tabId) {
    try {
        const avatarUrl = `/images/1.jpg`;
        const chatItem = document.querySelector(`#chatTabs li[onclick="openTab('${tabId}')"] .ml-3`);
        chatItem.innerHTML = `
            <img src="${avatarUrl}" alt="Avatar" class="avatar mr-2">
            ${chatItem.innerHTML}
        `;
    } catch (error) {
        console.error('Error fetching avatar:', error);
    }
}

async function sendMessage(tabId) {
    const userInput = document.getElementById(`user-input-${tabId}`).value;
    const imageInput = document.getElementById(`image-input-${tabId}`).files[0];

    if (!userInput && !imageInput) return;

    if (userInput) {
        displayMessage(tabId, userInput, 'user-message');
        window.conversations[tabId].push({
            role: 'user',
            content: userInput
        });
    }

    document.getElementById(`user-input-${tabId}`).value = '';

    const formData = new FormData();
    formData.append('conversation', JSON.stringify(window.conversations[tabId]));
    if (imageInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            displayMessage(tabId, `<img src="${base64Image}" class="img-thumbnail" />`, 'user-message');
            window.conversations[tabId].push({
                role: 'user',
                content: { type: 'image', data: base64Image }
            });
            formData.append('image', imageInput);
            sendToServer(formData, tabId);
        };
        reader.readAsDataURL(imageInput);
    } else {
        sendToServer(formData, tabId);
    }
}

async function sendToServer(formData, tabId) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    displayMessage(tabId, data.reply, 'bot-message');
    window.conversations[tabId].push({
        role: 'assistant',
        content: data.reply
    });

    // Clear the image input after sending the message
    document.getElementById(`image-input-${tabId}`).value = '';
}

function displayMessage(tabId, message, className) {
    const chatContainer = document.getElementById(`messages-${tabId}`);
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    messageElement.innerHTML = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
