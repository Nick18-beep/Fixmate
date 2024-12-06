import React from 'react';
import ChessBoardEditor from './components/ChessBoardEditor'; 
import Navbar from './components/NavBar';
import ChatAi from './components/ChatAi';
import './App.css';

const App = () => {
  return (
    <div >      
      <Navbar />
      <div className="content-wrapper">
          <ChessBoardEditor />

        <div className="chat-container">
          <ChatAi />
        </div>
      </div>
    </div>
  );
};

export default App;
