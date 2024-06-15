import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './App.css';

const ChatApp = () => {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [activeChatId, setActiveChatId] = useState(1);

  const addChat = () => {
    const newChatId = chats.length + 1;
    setChats([...chats, { id: newChatId, messages: [] }]);
    setActiveChatId(newChatId);
  };

  const sendMessage = (chatId, message) => {
    setChats(chats.map(chat => chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat));
  };

  return (
    <div className="chat-app">
      <ChatList chats={chats} activeChatId={activeChatId} setActiveChatId={setActiveChatId} addChat={addChat} />
      <ChatWindow chat={chats.find(chat => chat.id === activeChatId)} sendMessage={sendMessage} />
    </div>
  );
};

export default ChatApp;
