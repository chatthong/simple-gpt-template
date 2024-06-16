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
                    <input type="file" id="image-input-${tabId}" accept="image/*" style="display: none;" onchange="handleImageUpload(event, '${tabId}')">
                    <button class="btn btn-primary" onclick="sendMessage('${tabId}')" type="button">Send</button>
                </div>
                <div id="image-preview-${tabId}" class="mt-2"></div>
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


function handleImageUpload(event, chatId) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                displayImagePreview(data.url, chatId);
                // Add the image URL to the conversation
                window.conversations[chatId].push({
                    role: 'user',
                    content: { type: 'image', url: data.url }
                });
            } else {
                console.error('Image upload failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}



function displayImagePreview(imageUrl, chatId) {
    const previewContainer = document.getElementById(`image-preview-${chatId}`);
    previewContainer.innerHTML = `<img src="${imageUrl}" alt="Image" class="img-thumbnail" />`;
}

async function setAvatar(tabId) {
    try {
        const avatarUrl = `/images/1.jpg`;
        const chatItem = document.querySelector(`#chatTabs li .ml-3[onclick="openTab('${tabId}')"]`);
        if (chatItem) {
            chatItem.innerHTML = `
                <img src="${avatarUrl}" alt="Avatar" class="avatar mr-2">
                ${chatItem.innerHTML}
            `;
        } else {
            console.error('Chat item not found for tabId:', tabId);
        }
    } catch (error) {
        console.error('Error fetching avatar:', error);
    }
}

async function sendMessage(tabId) {
    const sendButton = document.querySelector(`#user-input-${tabId}`).nextElementSibling.nextElementSibling;
    const userInput = document.getElementById(`user-input-${tabId}`).value;

    if (!userInput && !window.conversations[tabId].some(msg => msg.content && msg.content.includes('uploads/'))) return;

    // Disable the send button to prevent multiple clicks
    sendButton.disabled = true;

    if (userInput) {
        displayMessage(tabId, userInput, '', 'user-message');
        window.conversations[tabId].push({
            role: 'user',
            content: userInput
        });
    }

    document.getElementById(`user-input-${tabId}`).value = '';

    const formData = new FormData();
    formData.append('conversation', JSON.stringify(window.conversations[tabId]));

    try {
        await sendToServer(formData, tabId);
    } catch (error) {
        console.error('Error sending message to server:', error);
    } finally {
        // Re-enable the send button after the message has been sent
        sendButton.disabled = false;
    }
}


async function sendToServer(formData, tabId) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Server response:', data);

        if (data.reply) {
            displayMessage(tabId, data.reply, '', 'bot-message');
            window.conversations[tabId].push({
                role: 'assistant',
                content: data.reply
            });
        } else {
            throw new Error('Invalid response data');
        }

        // Clear the image preview after sending the message
        document.getElementById(`image-preview-${tabId}`).innerHTML = '';
    } catch (error) {
        console.error('Error sending to server:', error);
    }
}

function displayMessage(tabId, message, imageUrl = '', className = 'user-message') {
    const chatContainer = document.getElementById(`messages-${tabId}`);
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    if (message) {
        messageElement.innerHTML = `<div>${message}</div>`;
    }
    if (imageUrl) {
        messageElement.innerHTML += `<img src="${imageUrl}" class="img-thumbnail" />`;
    }
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Update last message preview
    updateLastMessagePreview(tabId, message);
}


function updateLastMessagePreview(tabId, message) {
    const previewText = message.length > 20 ? message.substring(0, 20) + '...' : message;
    const chatItem = document.querySelector(`#chatTabs li .ml-3[onclick="openTab('${tabId}')"] small`);
    if (chatItem) {
        chatItem.textContent = previewText;
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
}
