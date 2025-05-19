/**
 * Parses the input text file content into a structured board representation
 * @param {string} inputText - Content of the input text file
 * @returns {Object} Object containing board, vehicles, primaryPiece, and exitPoint information
 */
export const parseInput = (inputText) => {
  try {
    // Split the input into lines and remove any empty lines
    const lines = inputText.trim().split('\n').filter(line => line.trim() !== '');
    
    // Parse the first line to get board dimensions
    const [rows, cols] = lines[0].trim().split(' ').map(Number);
    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      throw new Error('Invalid board dimensions');
    }
    
    // Parse the second line to get number of non-primary pieces
    const numVehicles = parseInt(lines[1].trim(), 10);
    if (isNaN(numVehicles) || numVehicles < 0) {
      throw new Error('Invalid number of vehicles');
    }
    
    // Check if there are enough lines for the board configuration
    if (lines.length < 3 || lines.length < 3 + rows) {
      throw new Error('Not enough lines for board configuration');
    }
    
    // Parse the board configuration
    const board = [];
    const vehiclePositions = new Map(); // Map to track positions of each vehicle
    let primaryPiece = null;
    let exitPoint = null;
    
    for (let i = 0; i < rows; i++) {
      const rowLine = lines[i + 2].trim();
      
      // Check if the row has the correct length
      if (rowLine.length !== cols) {
        throw new Error(`Row ${i + 1} has invalid length (expected ${cols}, got ${rowLine.length})`);
      }
      
      const row = rowLine.split('');
      board.push(row);
      
      // Process each cell in the row
      for (let j = 0; j < cols; j++) {
        const cell = row[j];
        
        // Skip empty cells
        if (cell === '.') continue;
        
        // Check for exit point
        if (cell === 'K') {
          if (exitPoint !== null) {
            throw new Error('Multiple exit points found');
          }
          exitPoint = { row: i, col: j };
          // Replace 'K' with '.' on the board since it's just a marker
          row[j] = '.';
          continue;
        }
        
        // Check for primary piece
        if (cell === 'P') {
          if (!vehiclePositions.has('P')) {
            vehiclePositions.set('P', []);
          }
          vehiclePositions.get('P').push({ row: i, col: j });
          continue;
        }
        
        // Regular vehicle
        if (!vehiclePositions.has(cell)) {
          vehiclePositions.set(cell, []);
        }
        vehiclePositions.get(cell).push({ row: i, col: j });
      }
    }
    
    // Verify we found exactly one primary piece with at least one cell
    if (!vehiclePositions.has('P') || vehiclePositions.get('P').length === 0) {
      throw new Error('No primary piece found');
    }
    
    // Verify we found exactly one exit point
    if (exitPoint === null) {
      throw new Error('No exit point found');
    }
    
    // Process vehicle positions to determine their properties (orientation, size)
    const vehicles = [];
    
    for (const [id, positions] of vehiclePositions) {
      // Sort positions by row and column for easier processing
      positions.sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      });
      
      // Determine if the vehicle is horizontal (same row) or vertical (same column)
      const isHorizontal = positions.every(pos => pos.row === positions[0].row);
      const isVertical = positions.every(pos => pos.col === positions[0].col);
      
      if (!isHorizontal && !isVertical) {
        throw new Error(`Vehicle ${id} has invalid shape (must be straight line)`);
      }
      
      const orientation = isHorizontal ? 'horizontal' : 'vertical';
      const size = positions.length;
      
      const vehicle = {
        id,
        positions,
        orientation,
        size,
        isPrimary: id === 'P'
      };
      
      vehicles.push(vehicle);
      
      if (id === 'P') {
        primaryPiece = vehicle;
      }
    }
    
    // Verify the exit point is at the edge of the board and aligned with primary piece
    const isExitAtEdge = 
      exitPoint.row === 0 || 
      exitPoint.row === rows - 1 || 
      exitPoint.col === 0 || 
      exitPoint.col === cols - 1;
    
    if (!isExitAtEdge) {
      throw new Error('Exit point must be at the edge of the board');
    }
    
    const isExitAlignedWithPrimary = 
      (primaryPiece.orientation === 'horizontal' && exitPoint.row === primaryPiece.positions[0].row) ||
      (primaryPiece.orientation === 'vertical' && exitPoint.col === primaryPiece.positions[0].col);
    
    if (!isExitAlignedWithPrimary) {
      throw new Error('Exit point must be aligned with the primary piece');
    }
    
    return {
      board,
      vehicles,
      primaryPiece,
      exitPoint
    };
  } catch (error) {
    throw new Error(`Error parsing input: ${error.message}`);
  }
};
