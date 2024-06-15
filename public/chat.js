window.conversations = {};

// Existing function to send messages
function sendMessage(chatId) {
    const userInput = document.getElementById(`user-input-${chatId}`);
    const messageContent = userInput.value;
    if (messageContent.trim() !== '') {
        const messageContainer = document.getElementById(`messages-${chatId}`);

        // Initialize conversation if it doesn't exist
        if (!window.conversations[chatId]) {
            window.conversations[chatId] = [];
        }

        // Add user message to the conversation
        window.conversations[chatId].push({ type: 'user', content: messageContent });

        // Add user message to chat window
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
            const botMessageContent = 'This is a bot response';
            window.conversations[chatId].push({ type: 'bot', content: botMessageContent });

            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot-message';
            botMessage.innerHTML = `<p>${botMessageContent}</p>`;
            messageContainer.appendChild(botMessage);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 1000);
    }
}

// Function to update last message preview
function updateLastMessagePreview(chatId, message) {
    const chatItem = document.querySelector(`li[onclick="openTab('${chatId}')"] small`);
    if (chatItem) {
        chatItem.textContent = message;
    }
}

// Function to close chat
function closeChat(chatId) {
    const chatTab = document.getElementById(chatId);
    if (chatTab) {
        chatTab.remove();
    }
    const chatListItem = document.querySelector(`li[onclick="openTab('${chatId}')"]`);
    if (chatListItem) {
        chatListItem.remove();
    }
    // Optionally, switch to another tab if needed
}

// Function to open a chat tab
function openTab(chatId) {
    const tabcontents = document.querySelectorAll('.tabcontent');
    tabcontents.forEach(tabcontent => {
        tabcontent.classList.remove('active');
    });
    const currentTab = document.getElementById(chatId);
    if (currentTab) {
        currentTab.classList.add('active');
    }
}

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
            <button class="btn btn-danger btn-sm close-chat" onclick="event.stopPropagation(); closeChat('${newChatId}')">X</button>
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

    // Initialize conversation array for the new chat
    window.conversations[newChatId] = [];
}

// Function to initialize event listeners for existing chat items
function initializeChatItems() {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
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
}

// Call the initialize function to set up event listeners
initializeChatItems();
