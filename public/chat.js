document.addEventListener('DOMContentLoaded', function() {
    openTab('Chat1');
    if (!window.conversations) {
        window.conversations = {
            Chat1: []
        };
    }

    // Fetch and set random avatars for each chat
    setRandomAvatar('Chat1');
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
                    <input type="file" id="image-input-${tabId}" accept="image/*" style="display: none;">
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

    // Fetch and set random avatars for the new chat tab
    setRandomAvatar(tabId);
}

async function setRandomAvatar(tabId) {
    try {
        const response = await fetch('https://avatars.dicebear.com/api/fun-emoji/:seed.svg');
        const avatarUrl = response.url;
        const chatItem = document.querySelector(`#chatTabs li[onclick="openTab('${tabId}')"] .ml-3`);
        chatItem.innerHTML = `
            <img src="${avatarUrl}" alt="Avatar" class="avatar mr-2">
            ${chatItem.innerHTML}
        `;
    } catch (error) {
        console.error('Error fetching random avatar:', error);
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
}

function displayMessage(tabId, message, className) {
    const chatContainer = document.getElementById(`messages-${tabId}`);
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    messageElement.innerHTML = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
