export const boardToString = (board) => {
  return board.map(row => row.join('')).join('');
};


export const cloneBoard = (board) => {
  return board.map(row => [...row]);
};


export const cloneVehicle = (vehicle) => {
  return {
    ...vehicle,
    positions: vehicle.positions.map(pos => ({ ...pos }))
  };
};


export const cloneVehicles = (vehicles) => {
  return vehicles.map(vehicle => cloneVehicle(vehicle));
};


export const getPossibleMoves = (state) => {
  const { board, vehicles } = state;
  const possibleMoves = [];
  
  vehicles.forEach(vehicle => {
    const { id, orientation, positions } = vehicle;
    
    if (orientation === 'horizontal') {
      const canMoveLeft = positions[0].col > 0 && 
                         board[positions[0].row][positions[0].col - 1] === '.';
      
      if (canMoveLeft) {
        const newState = makeMove(state, vehicle, 'left');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'left';
          possibleMoves.push(newState);
        }
      }
      const lastPos = positions[positions.length - 1];
      const canMoveRight = lastPos.col < board[0].length - 1 && 
                          board[lastPos.row][lastPos.col + 1] === '.';
      
      const specialCustomExit = state.exitPoint && 
                               vehicle.isPrimary && 
                               positions.some(pos => pos.col === state.exitPoint.col && 
                                                   pos.row === board.length - 2) &&
                               state.exitPoint.row === board.length - 1;
      
      if (canMoveRight || specialCustomExit) {
        const newState = makeMove(state, vehicle, 'right');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'right';
          possibleMoves.push(newState);
        }
      }
    } else if (orientation === 'vertical') {
      const canMoveUp = positions[0].row > 0 && 
                       board[positions[0].row - 1][positions[0].col] === '.';
      
      if (canMoveUp) {
        const newState = makeMove(state, vehicle, 'up');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'up';
          possibleMoves.push(newState);
        }
      }
      const lastPos = positions[positions.length - 1];
      const canMoveDown = lastPos.row < board.length - 1 && 
                         board[lastPos.row + 1][lastPos.col] === '.';
      
      const specialExit = state.exitPoint && 
                         vehicle.isPrimary && 
                         lastPos.row === board.length - 2 && 
                         lastPos.col === state.exitPoint.col &&
                         state.exitPoint.row === board.length - 1;
      
      if (canMoveDown || specialExit) {
        const newState = makeMove(state, vehicle, 'down');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'down';
          possibleMoves.push(newState);
        }
      }
    }
  });
  
  return possibleMoves;
};


export const makeMove = (state, vehicle, direction) => {
  const { board, vehicles, primaryPiece, exitPoint } = state;
  
  const newBoard = cloneBoard(board);
  const newVehicles = cloneVehicles(vehicles);
  
  const vehicleIndex = newVehicles.findIndex(v => v.id === vehicle.id);
  if (vehicleIndex === -1) return null;
  
  const newVehicle = newVehicles[vehicleIndex];
  
  newVehicle.positions.forEach(pos => {
    newBoard[pos.row][pos.col] = '.';
  });
  
  const newPositions = newVehicle.positions.map(pos => {
    const newPos = { ...pos };
    
    switch (direction) {
      case 'left':
        newPos.col -= 1;
        break;
      case 'right':
        newPos.col += 1;
        break;
      case 'up':
        newPos.row -= 1;
        break;
      case 'down':
        newPos.row += 1;
        break;
    }
    
    return newPos;
  });

  const isValid = newPositions.every(pos => {

    if (pos.row < 0 || pos.row >= newBoard.length || 
        pos.col < 0 || pos.col >= newBoard[0].length) {

      if (newVehicle.isPrimary) {

        if (pos.row === exitPoint.row && pos.col === exitPoint.col) {
          return true;
        }
      }
      return false;
    }
    

    return newBoard[pos.row][pos.col] === '.';
  });
  
  if (!isValid) return null;
  
  newVehicle.positions = newPositions;

  newPositions.forEach(pos => {

    if (pos.row >= 0 && pos.row < newBoard.length && 
        pos.col >= 0 && pos.col < newBoard[0].length) {
      newBoard[pos.row][pos.col] = newVehicle.id;
    }
  });
  
  let newPrimaryPiece = primaryPiece;
  if (newVehicle.isPrimary) {
    newPrimaryPiece = newVehicle;
  }
  
  return {
    board: newBoard,
    vehicles: newVehicles,
    primaryPiece: newPrimaryPiece,
    exitPoint
  };
};

export const isSolved = (state) => {
  const { primaryPiece, exitPoint, board } = state;
  
  console.log("Checking if solved:", {
    primaryPiece,
    exitPoint,
    boardDimensions: { rows: board.length, cols: board[0].length }
  });

  if (primaryPiece.orientation === 'horizontal') {
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    const leftmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.col < min.col ? pos : min;
    }, primaryPiece.positions[0]);
    
    console.log("Horizontal piece positions:", {
      rightmost,
      leftmost,
      exitPoint
    });
    
    if (exitPoint.row === board.length - 1) {
      const pieceAtExit = primaryPiece.positions.some(pos => 
        pos.row === board.length - 1 && pos.col === exitPoint.col
      );
      if (pieceAtExit) {
        console.log("Solved: Bottom row exit at column", exitPoint.col);
        return true;
      }
    }
    
    if (exitPoint.col === board[0].length - 1 && rightmost.col === board[0].length - 1) {
      console.log("Solved: Right exit");
      return true;
    }
    
    if (exitPoint.col === 0 && leftmost.col === 0) {
      console.log("Solved: Left exit");
      return true;
    }
  }
  if (primaryPiece.orientation === 'vertical') {
    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);

    const topmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.row < min.row ? pos : min;
    }, primaryPiece.positions[0]);
    
    if (exitPoint.row === board.length - 1 && bottommost.row === board.length - 1) {
      return true;
    }
    
    if (exitPoint.row === 0 && topmost.row === 0) {
      return true;
    }
  }
  
  return false;
};


export const manhattanDistance = (position, target) => {
  return Math.abs(position.row - target.row) + Math.abs(position.col - target.col);
};

export const distanceToExit = (state) => {
  const { primaryPiece, exitPoint, board } = state;

  if (primaryPiece.orientation === 'horizontal') {
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    if (exitPoint.col === board[0].length - 1) {
      return Math.max(0, board[0].length - 1 - rightmost.col);
    }
    
    if (exitPoint.col === 0) {
      return primaryPiece.positions[0].col;
    }
  }
  
  if (primaryPiece.orientation === 'vertical') {
    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);
    
    if (exitPoint.row === board.length - 1) {
      return Math.max(0, board.length - 1 - bottommost.row);
    }
    
    if (exitPoint.row === 0) {
      return primaryPiece.positions[0].row;
    }
  }
  
  return 999; 
};

export const countBlockingVehicles = (state) => {
  const { board, primaryPiece, exitPoint } = state;
  
  let count = 0;
  
  if (primaryPiece.orientation === 'horizontal') {
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    const leftmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.col < min.col ? pos : min;
    }, primaryPiece.positions[0]);
    
    const row = rightmost.row;
    
    if (exitPoint.col === board[0].length - 1) {
      const startCol = rightmost.col + 1;
      const endCol = board[0].length - 1;
      
      const blockers = new Set();
      for (let col = startCol; col <= endCol; col++) {
        if (col >= board[0].length) continue;
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
      
      count = blockers.size;
    } 
    else if (exitPoint.col === 0) {
      const startCol = 0;
      const endCol = leftmost.col - 1;
      
      const blockers = new Set();
      for (let col = startCol; col <= endCol; col++) {
        if (col < 0) continue;
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
      
      count = blockers.size;
    }
  } else {

    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);
    
    const topmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.row < min.row ? pos : min;
    }, primaryPiece.positions[0]);
    
    const col = bottommost.col;
    
    if (exitPoint.row === board.length - 1) {
      const startRow = bottommost.row + 1;
      const endRow = board.length - 1;
      
      const blockers = new Set();
      for (let row = startRow; row <= endRow; row++) {
        if (row >= board.length) continue;
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
      
      count = blockers.size;
    } 

    else if (exitPoint.row === 0) {
      const startRow = 0;
      const endRow = topmost.row - 1;
      
      const blockers = new Set();
      for (let row = startRow; row <= endRow; row++) {
        if (row < 0) continue;
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
      
      count = blockers.size;
    }
  }
  
  return count;
};

export const reconstructPath = (cameFrom, current) => {
  const path = [current];
  let currentKey = boardToString(current.board);
  
  while (cameFrom.has(currentKey)) {
    current = cameFrom.get(currentKey);
    currentKey = boardToString(current.board);
    path.unshift(current);
  }
  
  return path;
};
