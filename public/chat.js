document.addEventListener('DOMContentLoaded', function() {
    openTab('Chat1');
    if (!window.conversations) {
        window.conversations = {
            Chat1: []
        };
    }

    // Fetch and set predefined avatars for each chat
    setAvatar('Chat1');

    // Enable Enter key to send messages
    document.getElementById('user-input-Chat1').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage('Chat1');
            event.preventDefault();
        }
    });
});

function openTab(tabId) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    document.getElementById(tabId).classList.add('active');

    // Enable Enter key to send messages
    const userInput = document.getElementById(`user-input-${tabId}`);
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage(tabId);
            event.preventDefault();
        }
    });
}

let tabCount = 1;

function addTab() {
    tabCount++;
    const tabId = `Chat${tabCount}`;

    const newTabButton = document.createElement('li');
    newTabButton.className = 'chat-item';
    newTabButton.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="ml-3" onclick="openTab('${tabId}')">
                <h6 class="mb-0">Chat #${tabCount}</h6>
                <small>Last message preview...</small>
            </div>
            <button class="btn btn-danger btn-sm close-chat" onclick="event.stopPropagation(); closeChat('${tabId}')">X</button>
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
                    <input type="file" id="image-input-${tabId}" accept="image/*" style="display: none;" onchange="handleImageChange(event, '${tabId}')">
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

function handleImageChange(event, tabId) {
    const imageInput = event.target;
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            displayMessage(tabId, `<img src="${base64Image}" class="img-thumbnail" />`, 'user-message');
            window.conversations[tabId].push({
                role: 'user',
                content: { type: 'image', data: base64Image }
            });
        };
        reader.readAsDataURL(file);
    }
}

async function setAvatar(tabId) {
    try {
        const avatarUrl = `/images/1.jpg`; // Make sure this path is correct
        const chatItem = document.querySelector(`#chatTabs li .ml-3[onclick="openTab('${tabId}')"]`);
        if (chatItem) {
            chatItem.innerHTML = `
                <img src="${avatarUrl}" alt="Avatar" class="avatar mr-2">
                ${chatItem.innerHTML}
            `;
        }
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

    // Update last message preview
    updateLastMessagePreview(tabId, message);
}

// Function to update last message preview
function updateLastMessagePreview(tabId, message) {
    const previewText = typeof message === 'string' ? message : 'Image';
    const truncatedPreviewText = previewText.length > 20 ? previewText.substring(0, 20) + '...' : previewText;
    const chatItem = document.querySelector(`#chatTabs li .ml-3[onclick="openTab('${tabId}')"] small`);
    if (chatItem) {
        chatItem.textContent = truncatedPreviewText;
    }
}

function closeChat(tabId) {
    const chatTab = document.getElementById(tabId);
    if (chatTab) {
        chatTab.remove();
    }
    const chatListItem = document.querySelector(`#chatTabs li .ml-3[onclick="openTab('${tabId}')"]`).parentElement.parentElement;
    if (chatListItem) {
        chatListItem.remove();
    }
    // Optionally, switch to another tab if needed
}
