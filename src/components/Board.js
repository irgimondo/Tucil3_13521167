import React from 'react';
import './Board.css';

const Board = ({ board, vehicles, primaryPiece, exitPoint, isAnimating, currentStep }) => {
  if (!board) return null;

  // Function to get the piece at a specific position (row, col)
  const getPieceAt = (row, col) => {
    // If we're animating and have a currentStep, use the board state from that step
    if (isAnimating && currentStep && currentStep.board) {
      return currentStep.board[row][col];
    }
    
    // Otherwise use the current board state
    return board[row][col];
  };

  // Function to determine if a cell is the exit point
  const isExitCell = (row, col) => {
    if (!exitPoint) return false;
    return row === exitPoint.row && col === exitPoint.col;
  };

  // Function to get class name for each cell
  const getCellClass = (cellValue, row, col) => {
    let classes = 'board-cell';
    
    // Add class for exit point
    if (isExitCell(row, col)) {
      classes += ' exit-cell';
    }
    
    // Empty cell
    if (cellValue === '.') {
      return classes + ' empty-cell';
    }
    
    // Primary piece (target vehicle)
    if (cellValue === 'P') {
      return classes + ' primary-piece';
    }
    
    // Regular vehicle pieces
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
