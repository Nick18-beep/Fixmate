import React from 'react';
import ChessBoardEditor from './components/ChessBoardEditor'; 
import Navbar from './components/NavBar';
import { Container, Row, Col } from "react-bootstrap";
import './App.css';

const App = () => {
  return (
    <Container fluid>
      
      <Navbar />
        
      <ChessBoardEditor />
       

    </Container>
  );
};

export default App;
