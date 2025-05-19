/**
 * Utilities for board state representation and manipulation
 */

/**
 * Generates a unique string representation of the board state for comparing states
 * @param {Array} board - 2D array representing the board
 * @returns {string} A string representation of the board
 */
export const boardToString = (board) => {
  return board.map(row => row.join('')).join('');
};

/**
 * Creates a deep copy of a board
 * @param {Array} board - 2D array representing the board
 * @returns {Array} A deep copy of the board
 */
export const cloneBoard = (board) => {
  return board.map(row => [...row]);
};

/**
 * Creates a deep copy of a vehicle object
 * @param {Object} vehicle - The vehicle to clone
 * @returns {Object} A deep copy of the vehicle
 */
export const cloneVehicle = (vehicle) => {
  return {
    ...vehicle,
    positions: vehicle.positions.map(pos => ({ ...pos }))
  };
};

/**
 * Creates a deep copy of an array of vehicles
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Array} A deep copy of the vehicles array
 */
export const cloneVehicles = (vehicles) => {
  return vehicles.map(vehicle => cloneVehicle(vehicle));
};

/**
 * Gets all possible moves from the current board state
 * @param {Object} state - Current state with board and vehicles
 * @returns {Array} Array of possible next states
 */
export const getPossibleMoves = (state) => {
  const { board, vehicles } = state;
  const possibleMoves = [];
  
  // Try moving each vehicle in both directions
  vehicles.forEach(vehicle => {
    const { id, orientation, positions } = vehicle;
    
    if (orientation === 'horizontal') {
      // Try moving left
      if (positions[0].col > 0 && board[positions[0].row][positions[0].col - 1] === '.') {
        const newState = makeMove(state, vehicle, 'left');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'left';
          possibleMoves.push(newState);
        }
      }
      
      // Try moving right
      const lastPos = positions[positions.length - 1];
      if (lastPos.col < board[0].length - 1 && board[lastPos.row][lastPos.col + 1] === '.') {
        const newState = makeMove(state, vehicle, 'right');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'right';
          possibleMoves.push(newState);
        }
      }
    } else if (orientation === 'vertical') {
      // Try moving up
      if (positions[0].row > 0 && board[positions[0].row - 1][positions[0].col] === '.') {
        const newState = makeMove(state, vehicle, 'up');
        if (newState) {
          newState.movedVehicle = id;
          newState.direction = 'up';
          possibleMoves.push(newState);
        }
      }
      
      // Try moving down
      const lastPos = positions[positions.length - 1];
      if (lastPos.row < board.length - 1 && board[lastPos.row + 1][lastPos.col] === '.') {
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

/**
 * Makes a move in the given direction for the specified vehicle
 * @param {Object} state - Current state
 * @param {Object} vehicle - Vehicle to move
 * @param {string} direction - Direction to move ('left', 'right', 'up', 'down')
 * @returns {Object|null} New state after the move, or null if move is invalid
 */
export const makeMove = (state, vehicle, direction) => {
  const { board, vehicles, primaryPiece, exitPoint } = state;
  
  // Create new copies of the board and vehicles
  const newBoard = cloneBoard(board);
  const newVehicles = cloneVehicles(vehicles);
  
  // Find the vehicle in the new vehicles array
  const vehicleIndex = newVehicles.findIndex(v => v.id === vehicle.id);
  if (vehicleIndex === -1) return null;
  
  const newVehicle = newVehicles[vehicleIndex];
  
  // First, clear the vehicle from the board
  newVehicle.positions.forEach(pos => {
    newBoard[pos.row][pos.col] = '.';
  });
  
  // Calculate new positions
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
  
  // Check if the new positions are valid (within board and not occupied)
  const isValid = newPositions.every(pos => {
    // Check if within board boundaries
    if (pos.row < 0 || pos.row >= newBoard.length || 
        pos.col < 0 || pos.col >= newBoard[0].length) {
      // Special case: primary piece moving to exit point
      if (newVehicle.isPrimary && 
          pos.row === exitPoint.row && 
          pos.col === exitPoint.col) {
        return true;
      }
      return false;
    }
    
    // Check if position is empty
    return newBoard[pos.row][pos.col] === '.';
  });
  
  if (!isValid) return null;
  
  // Update the vehicle's positions
  newVehicle.positions = newPositions;
  
  // Place the vehicle back on the board
  newPositions.forEach(pos => {
    // Only place on board if within boundaries
    if (pos.row >= 0 && pos.row < newBoard.length && 
        pos.col >= 0 && pos.col < newBoard[0].length) {
      newBoard[pos.row][pos.col] = newVehicle.id;
    }
  });
  
  // Update primaryPiece if necessary
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

/**
 * Checks if the puzzle is solved (primary piece at exit)
 * @param {Object} state - Current state
 * @returns {boolean} True if puzzle is solved, false otherwise
 */
export const isSolved = (state) => {
  const { primaryPiece, exitPoint, board } = state;
  
  // For horizontal primary piece
  if (primaryPiece.orientation === 'horizontal') {
    // Get the rightmost position of the primary piece
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    // If exit is on the right edge, check if primary piece is adjacent to it
    if (exitPoint.col === board[0].length - 1 && rightmost.col === board[0].length - 1) {
      return true;
    }
    
    // If exit is on the left edge, check if primary piece is adjacent to it
    if (exitPoint.col === 0 && primaryPiece.positions.some(pos => pos.col === 0)) {
      return true;
    }
  }
  
  // For vertical primary piece
  if (primaryPiece.orientation === 'vertical') {
    // Get the bottommost position of the primary piece
    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);
    
    // If exit is on the bottom edge, check if primary piece is adjacent to it
    if (exitPoint.row === board.length - 1 && bottommost.row === board.length - 1) {
      return true;
    }
    
    // If exit is on the top edge, check if primary piece is adjacent to it
    if (exitPoint.row === 0 && primaryPiece.positions.some(pos => pos.row === 0)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Calculate Manhattan distance heuristic
 * @param {Object} position - Position with row and col
 * @param {Object} target - Target position with row and col
 * @returns {number} Manhattan distance
 */
export const manhattanDistance = (position, target) => {
  return Math.abs(position.row - target.row) + Math.abs(position.col - target.col);
};

/**
 * Calculates the distance from primary piece to exit point
 * @param {Object} state - Current state
 * @returns {number} Distance to exit
 */
export const distanceToExit = (state) => {
  const { primaryPiece, exitPoint, board } = state;
  
  // For horizontal primary pieces
  if (primaryPiece.orientation === 'horizontal') {
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    // If exit is on the right
    if (exitPoint.col === board[0].length - 1) {
      return Math.max(0, board[0].length - 1 - rightmost.col);
    }
    
    // If exit is on the left
    if (exitPoint.col === 0) {
      return primaryPiece.positions[0].col;
    }
  }
  
  // For vertical primary pieces
  if (primaryPiece.orientation === 'vertical') {
    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);
    
    // If exit is on the bottom
    if (exitPoint.row === board.length - 1) {
      return Math.max(0, board.length - 1 - bottommost.row);
    }
    
    // If exit is on the top
    if (exitPoint.row === 0) {
      return primaryPiece.positions[0].row;
    }
  }
  
  // If we get here, something is wrong with the exit point configuration
  return 999; // Return a large number as a fallback
};

/**
 * Count vehicles blocking the path to the exit
 * @param {Object} state - Current state
 * @returns {number} Number of blocking vehicles
 */
export const countBlockingVehicles = (state) => {
  const { board, primaryPiece, exitPoint } = state;
  
  let count = 0;
  
  if (primaryPiece.orientation === 'horizontal') {
    // For horizontal primary pieces, check all cells between the primary piece and the edge
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    const leftmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.col < min.col ? pos : min;
    }, primaryPiece.positions[0]);
    
    const row = rightmost.row;
    
    // If exit is on the right edge
    if (exitPoint.col === board[0].length - 1) {
      const startCol = rightmost.col + 1;
      const endCol = board[0].length - 1;
      
      // Count unique vehicles in the path
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
    // If exit is on the left edge
    else if (exitPoint.col === 0) {
      const startCol = 0;
      const endCol = leftmost.col - 1;
      
      // Count unique vehicles in the path
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
    // For vertical primary pieces, check all cells between the primary piece and the edge
    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);
    
    const topmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.row < min.row ? pos : min;
    }, primaryPiece.positions[0]);
    
    const col = bottommost.col;
    
    // If exit is on the bottom edge
    if (exitPoint.row === board.length - 1) {
      const startRow = bottommost.row + 1;
      const endRow = board.length - 1;
      
      // Count unique vehicles in the path
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
    // If exit is on the top edge
    else if (exitPoint.row === 0) {
      const startRow = 0;
      const endRow = topmost.row - 1;
      
      // Count unique vehicles in the path
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

/**
 * Reconstructs the path from start to goal
 * @param {Map} cameFrom - Map of states and their predecessors
 * @param {Object} current - Current state (goal)
 * @returns {Array} Array of states from start to goal
 */
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
