import React, { useState } from 'react';
import '../App.css';
import { Container, Row, Col } from "react-bootstrap";

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

  const saveBoardState = (newBoard) => {
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
      <br></br>
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
                    <button onClick={undoLastAction} disabled={historyIndex === 0}>
                      Undo
                    </button>
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
