import React from 'react';
import ChatWindow from './ChatWindow';
import './styles.css';

const App = () => {
  return (
    <div className="container-fluid">
      <div className="row no-gutters">
        <div className="col-12 col-md-9">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default App;
