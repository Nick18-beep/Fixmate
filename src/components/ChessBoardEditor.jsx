import React, { useState } from 'react';
import '../App.css';
import { Container, Row, Col } from "react-bootstrap";
import { TbArrowBackUp } from "react-icons/tb";

const PIECES = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

const getInitialBoardState = () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // White pieces setup
  board[7] = [
    { piece: 'rook', color: 'white' },
    { piece: 'knight', color: 'white' },
    { piece: 'bishop', color: 'white' },
    { piece: 'queen', color: 'white' },
    { piece: 'king', color: 'white' },
    { piece: 'bishop', color: 'white' },
    { piece: 'knight', color: 'white' },
    { piece: 'rook', color: 'white' },
  ];
  board[6] = Array(8).fill({ piece: 'pawn', color: 'white' });

  // Black pieces setup
  board[0] = [
    { piece: 'rook', color: 'black' },
    { piece: 'knight', color: 'black' },
    { piece: 'bishop', color: 'black' },
    { piece: 'queen', color: 'black' },
    { piece: 'king', color: 'black' },
    { piece: 'bishop', color: 'black' },
    { piece: 'knight', color: 'black' },
    { piece: 'rook', color: 'black' },
  ];
  board[1] = Array(8).fill({ piece: 'pawn', color: 'black' });

  return board;
};

const ChessBoardEditor = () => {
  const initialBoard = getInitialBoardState();
  const [boardState, setBoardState] = useState(initialBoard);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [boardHistory, setBoardHistory] = useState([initialBoard]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('white');

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };



  
  const areBoardsEqual = (board1, board2) => {
    if (board1.length !== board2.length) return false;
  
    for (let i = 0; i < board1.length; i++) {
      for (let j = 0; j < board1[i].length; j++) {
        const square1 = board1[i][j];
        const square2 = board2[i][j];
  
        // Confronta i pezzi
        if (
          (square1 && square2 && square1.piece !== square2.piece) ||
          (square1 && square2 && square1.color !== square2.color) ||
          (!square1 && square2) ||
          (square1 && !square2)
        ) {
          return false;
        }
      }
    }
  
    return true;
  };
  
  const saveBoardState = (newBoard) => {
    const previousBoard = boardHistory[historyIndex];
  
    // Confronta lo stato corrente con quello precedente
    if (areBoardsEqual(newBoard, previousBoard)) {
      // Se i due stati sono identici, forza solo il rendering senza salvare
      setBoardState(newBoard); // Rirenderizza comunque per assicurare la coerenza
      return;
    }
  
    // Salva il nuovo stato solo se è diverso
    const newHistory = boardHistory.slice(0, historyIndex + 1);
    newHistory.push(newBoard);
    setBoardHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setBoardState(newBoard);
  };




  const startDragging = (piece, color, row = null, col = null) => {
    const newBoard = row !== null && col !== null 
      ? boardState.map((r, rIdx) =>
          r.map((c, cIdx) => (rIdx === row && cIdx === col ? null : c))
        )
      : [...boardState];

    setDraggedPiece({ piece, color });
    setBoardState(newBoard);
    window.addEventListener('mousemove', handleMouseMove);
  };

  const stopDragging = (e, targetRow = null, targetCol = null) => {
    window.removeEventListener('mousemove', handleMouseMove);
    
    if (targetRow !== null && targetCol !== null) {
      const newBoard = boardState.map((r, rIdx) =>
        r.map((c, cIdx) =>
          rIdx === targetRow && cIdx === targetCol ? draggedPiece : c
        )
      );
      
      saveBoardState(newBoard);
    }
    setDraggedPiece(null);
  };

  const undoLastAction = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBoardState(boardHistory[newIndex]);
    }
  };

  const redoLastAction = () => {
    if (historyIndex < boardHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBoardState(boardHistory[newIndex]);
    }
  };

  const clearBoard = () => {
    const emptyBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    saveBoardState(emptyBoard);
  };

  const resetBoard = () => {
    const initialBoard = getInitialBoardState();
    setBoardState(initialBoard);
    setBoardHistory([initialBoard]);
    setHistoryIndex(0);
  };

  return (
    <div >
      <div style={{ marginLeft:"50px" }}>
      <h1 style={{ fontFamily: "'Roboto', sans-serif", fontWeight: "bold" }}>
      Drag your pieces and ask the Bot
     </h1>
      </div>
      

      <div className="chessboard-wrapper">
      

              <div   className="chessboard" >
              {boardState.map((row, rowIndex) =>
                row.map((square, colIndex) => (
                  <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`square ${
                        (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
                      }`}
                      onMouseDown={(e) => e.preventDefault()} // Evita la selezione del testo
                      onMouseUp={() =>
                        draggedPiece && stopDragging(null, rowIndex, colIndex)
                      }
                    >
                      {square && (
                        <div
                          className="piece"
                          onMouseDown={() =>
                            startDragging(square.piece, square.color, rowIndex, colIndex)
                          }
                        >
                          {PIECES[square.color][square.piece]}
                        </div>
                      )}
                </div>
                ))
              )}
            </div>

            
                  
            <div className="buttons">
                    <button onClick={clearBoard}>Clear Board</button>
                    <button onClick={resetBoard}>Starting position</button>
                   
                    <button onClick={redoLastAction} disabled={historyIndex === boardHistory.length - 1}>
                      Redo
                    </button>
      </div>
           


      </div>



      
    

      <div className="controls">
        
      <div className="color-selector" >
    <button
      className={selectedColor === 'white' ? 'selected' : ''}
      onClick={() => setSelectedColor('white')}
    >
      White
    </button>
    <button
      className={selectedColor === 'black' ? 'selected' : ''}
      onClick={() => setSelectedColor('black')}
    >
      Black
    </button>
  </div>

 <div style={{display:"flex",alignItems:"center",gap:"10px", marginLeft: "130px", }}>
  <TbArrowBackUp className='back_arrow' onClick={undoLastAction} disabled={historyIndex === 0}  style={{
      cursor: historyIndex === 0 ? "not-allowed" : "pointer",
      color: historyIndex === 0 ? "gray" : "black",
       // Ingrandisce l'icona
    }}  > </TbArrowBackUp>

    <div className="piece-palette">
    <div className="pieces">

    {Object.keys(PIECES.white).map((piece) => (
      <div
        key={piece}
        className="piece"
        onMouseDown={(e) => {
          e.preventDefault(); // Disabilita la selezione del testo
          startDragging(piece, selectedColor);
        }}
      >
        {PIECES[selectedColor][piece]}
      </div>
    ))}
  </div>

</div>
</div>



      </div>
      {draggedPiece && (
        <div
          className="dragged-piece"
          style={{
            top: mousePosition.y - 20,
            left: mousePosition.x -20,
          }}
        >
          {PIECES[draggedPiece.color][draggedPiece.piece]}
        </div>
      )}
      
    </div>
  );
};

export default ChessBoardEditor;
