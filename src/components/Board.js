
import React from 'react';
import './Board.css';


const Board = ({ board, vehicles, primaryPiece, exitPoint, isAnimating, currentStep }) => {
  if (!board) return null;


  const getPieceAt = (row, col) => {
    if (isAnimating && currentStep && currentStep.board) {
      return currentStep.board[row][col];
    }
    
    return board[row][col];
  }; 

  const isExitCell = (row, col) => {
    if (!exitPoint) return false;
    
    if (row === exitPoint.row && col === exitPoint.col) {
      return true;
    }
    
    if (primaryPiece) {
      if (exitPoint.col === board[0].length && col === board[0].length - 1 && 
          row === exitPoint.row) {
        return true;
      }
      
      if (exitPoint.col === -1 && col === 0 && row === exitPoint.row) {
        return true;
      }
      
      if (exitPoint.row === board.length && row === board.length - 1 && 
          col === exitPoint.col) {
        return true;
      }
      
      if (exitPoint.row === -1 && row === 0 && col === exitPoint.col) {
        return true;
      }
    }
    
    return false;
  };


  const getCellClass = (cellValue, row, col) => {
    let classes = 'board-cell';
    
    if (isExitCell(row, col)) {
      classes += ' exit-cell';
    }
    
    if (cellValue === '.') {
      return classes + ' empty-cell';
    }
    
    if (cellValue === 'P') {
      return classes + ' primary-piece';
    }
    
    return classes + ` vehicle-piece vehicle-${cellValue.toLowerCase()}`;
  };

  return (
    <div className="board-wrapper">
      <div className="board" style={{ 
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`
      }}>
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(getPieceAt(rowIndex, colIndex), rowIndex, colIndex)}
              data-row={rowIndex}
              data-col={colIndex}
            >
              {getPieceAt(rowIndex, colIndex) !== '.' && getPieceAt(rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>
      <div className="board-info">
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color primary-piece"></div>
            <div className="legend-label">Primary Piece</div>
          </div>
          <div className="legend-item">
            <div className="legend-color exit-cell"></div>
            <div className="legend-label">Exit Point</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
