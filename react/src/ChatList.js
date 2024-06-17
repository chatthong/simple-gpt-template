import React from 'react';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="chat-list">
      <div className="p-3">
        <h5>Chat Sessions</h5>
        <ul className="list-unstyled">
          {chats.map((chat, index) => (
            <li key={index} className="chat-item" onClick={() => onSelectChat(chat.id)}>
              <div className="d-flex align-items-center">
                <div className="ml-3">
                  <h6 className="mb-0">Chat #{index + 1}</h6>
                  <small>Last message preview...</small>
                </div>
                <button className="btn btn-danger btn-sm close-chat">X</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="btn btn-secondary mt-3">New Chat</button>
      </div>
    </div>
  );
};

export default ChatList;
