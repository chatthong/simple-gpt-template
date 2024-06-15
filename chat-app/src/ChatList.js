import React from 'react';

const ChatList = ({ chats, activeChatId, setActiveChatId, addChat }) => {
  return (
    <div className="chat-list">
      <div className="p-3">
        <h5>Chat Sessions</h5>
        <ul className="list-unstyled">
          {chats.map(chat => (
            <li key={chat.id} className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => setActiveChatId(chat.id)}>
              <div className="d-flex align-items-center">
                <div className="ml-3">
                  <h6 className="mb-0">Chat #{chat.id}</h6>
                  <small>Last message preview...</small>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className="btn btn-secondary mt-3" onClick={addChat}>New Chat</button>
      </div>
    </div>
  );
};

export default ChatList;
