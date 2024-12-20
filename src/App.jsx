import React from 'react';
import ChessBoardEditor from './components/ChessBoardEditor'; 
import Navbar from './components/NavBar';
import ChatAi from './components/ChatAi';
import './App.css';
import { useState } from 'react';



const App = () => {

  const [fen, setFen]=useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [fenStatus, setFenStatus]= useState("init");//settiamo degli stati per capire se siamo nei seguenti casi: -init stato iniziale della scacchiera
                                                                                                                //-edit è cambiato qualcosa
                                                                                                                //-unedited non sono state eseguite modifiche
  const editFen = (f) => {//mi serve per modificare la fen in ChessBoard per poi poterla passare a ChatAI; 
      setFen(f);
      setFenStatus("edit");
  }
  const editStatus= () => {//lo stato deve essere impostato a false se non sono state effettuate modifiche per poter mandare i messaggi senza ripetere la sequenza FEN nalla chat
    setFenStatus("unedit");
  }

  return (
    <div >      
      <Navbar />
      <div className="content-wrapper">
          <ChessBoardEditor EditFen= {editFen}/>

        <div className="chat-container">
          <ChatAi board= {fen} status= {fenStatus} EditStatus= {editStatus}/>
        </div>
      </div>
    </div>
  );
};

export default App;
