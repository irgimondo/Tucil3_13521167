import { distanceToExit, countBlockingVehicles } from './boardUtils';

export const pathComplexity = (state) => {
  const { board, primaryPiece, exitPoint, vehicles } = state;
  
  const blockingCount = countBlockingVehicles(state);
  
  if (blockingCount === 0) return 0;
  
  let complexity = blockingCount;
  
  const blockingVehicles = findBlockingVehicles(state);
  
  for (const id of blockingVehicles) {
    const vehicle = vehicles.find(v => v.id === id);
    
    if (vehicle) {

      const secondaryBlockers = countSecondaryBlockers(state, vehicle);
      complexity += secondaryBlockers * 0.5; 
    }
  }
  
  return complexity;
};

export const findBlockingVehicles = (state) => {
  const { board, primaryPiece, exitPoint } = state;
  const blockers = new Set();
  
  if (primaryPiece.orientation === 'horizontal') {
    const rightmost = primaryPiece.positions.reduce((max, pos) => {
      return pos.col > max.col ? pos : max;
    }, primaryPiece.positions[0]);
    
    const leftmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.col < min.col ? pos : min;
    }, primaryPiece.positions[0]);
    
    const row = rightmost.row;
    
    if (exitPoint.col === board[0].length - 1 || exitPoint.col > rightmost.col) {
      for (let col = rightmost.col + 1; col < board[0].length; col++) {
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
    } 
    else if (exitPoint.col === 0 || exitPoint.col < leftmost.col) {
      for (let col = 0; col < leftmost.col; col++) {
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
    }
  } else {
    const bottommost = primaryPiece.positions.reduce((max, pos) => {
      return pos.row > max.row ? pos : max;
    }, primaryPiece.positions[0]);
    
    const topmost = primaryPiece.positions.reduce((min, pos) => {
      return pos.row < min.row ? pos : min;
    }, primaryPiece.positions[0]);
    
    const col = bottommost.col;
    
    if (exitPoint.row === board.length - 1 || exitPoint.row > bottommost.row) {
      for (let row = bottommost.row + 1; row < board.length; row++) {
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
    } 
    else if (exitPoint.row === 0 || exitPoint.row < topmost.row) {
      for (let row = 0; row < topmost.row; row++) {
        const cell = board[row][col];
        if (cell !== '.' && cell !== 'P') {
          blockers.add(cell);
        }
      }
    }
  }
  
  return blockers;
};


export const countSecondaryBlockers = (state, vehicle) => {
  const { board } = state;
  const blockers = new Set();
  
  if (vehicle.orientation === 'horizontal') {
    const row = vehicle.positions[0].row;
    const leftmost = vehicle.positions[0].col;
    const rightmost = vehicle.positions[vehicle.positions.length - 1].col;
    
    for (let col = leftmost - 1; col >= 0; col--) {
      const cell = board[row][col];
      if (cell !== '.') {
        blockers.add(cell);
        break; 
      }
    }
    
    for (let col = rightmost + 1; col < board[0].length; col++) {
      const cell = board[row][col];
      if (cell !== '.') {
        blockers.add(cell);
        break; 
      }
    }
  } else {
    const col = vehicle.positions[0].col;
    const topmost = vehicle.positions[0].row;
    const bottommost = vehicle.positions[vehicle.positions.length - 1].row;
    
    for (let row = topmost - 1; row >= 0; row--) {
      const cell = board[row][col];
      if (cell !== '.') {
        blockers.add(cell);
        break; 
      }
    }
    
    for (let row = bottommost + 1; row < board.length; row++) {
      const cell = board[row][col];
      if (cell !== '.') {
        blockers.add(cell);
        break; 
      }
    }
  }
  
  return blockers.size;
};

export const combinedHeuristic = (state) => {
  return distanceToExit(state) + pathComplexity(state);
};
