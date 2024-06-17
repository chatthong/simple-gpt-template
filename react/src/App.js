import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './styles.css';

const App = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([{ id: 1 }, { id: 2 }]); // Example chat data

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };

  return (
    <div className="container-fluid">
      <div className="row no-gutters">
        <div className="col-12 col-md-3">
          <ChatList chats={chats} onSelectChat={handleSelectChat} />
        </div>
        <div className="col-12 col-md-9">
          {selectedChatId && <ChatWindow selectedChatId={selectedChatId} />}
        </div>
      </div>
    </div>
  );
};

export default App;
