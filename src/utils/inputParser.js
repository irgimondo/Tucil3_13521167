export const parseInput = (inputText) => {
  try {
    const lines = inputText.trim().split('\n').filter(line => line.trim() !== '');
    const [rows, cols] = lines[0].trim().split(' ').map(Number);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      throw new Error('Invalid board dimensions');
    }
    
    const numVehicles = parseInt(lines[1].trim(), 10);
    if (isNaN(numVehicles) || numVehicles < 0) {
      throw new Error('Invalid number of vehicles');
    }
    
    if (lines.length < 3 || lines.length < 3 + rows) {
      throw new Error('Not enough lines for board configuration');
    }
    
    const board = [];
    const vehiclePositions = new Map(); 
    let primaryPiece = null;
    let exitPoint = null;
      // Look for 'K' in all rows to find the exit point
    for (let i = 0; i < rows + 2; i++) {  // +2 to check one row above and below the board
      if (i + 2 >= lines.length) continue;  // Skip if line doesn't exist
      
      const rowLine = lines[i + 2].trim();
      let rowToAdd = rowLine;
      
      // If this is within the actual grid rows (not extra row for K)
      if (i < rows) {
        // Check if K is at the beginning or end of the row (indicating it's outside)
        if (rowLine.startsWith('K')) {
          if (exitPoint !== null) {
            throw new Error('Multiple exit points found');
          }
          exitPoint = { row: i, col: -1 };  // -1 indicates left of the grid
          rowToAdd = rowLine.substring(1);  // Remove K from the row
        } else if (rowLine.endsWith('K')) {
          if (exitPoint !== null) {
            throw new Error('Multiple exit points found');
          }
          exitPoint = { row: i, col: cols };  // cols indicates right of the grid
          rowToAdd = rowLine.substring(0, rowLine.length - 1);  // Remove K from the row
        }
        
        // Check if the row has the right length after possibly removing K
        if (rowToAdd.length !== cols) {
          throw new Error(`Row ${i + 1} has invalid length (expected ${cols}, got ${rowToAdd.length})`);
        }
        
        const row = rowToAdd.split('');
        board.push(row);
        
        // Process each cell in the regular grid
        for (let j = 0; j < cols; j++) {
          const cell = row[j];
          
          if (cell === '.') continue;
          
          // Check for K inside the grid (should not happen with new format)
          if (cell === 'K') {
            throw new Error('Exit point (K) should be outside the grid, not inside');
          }          if (cell === 'P') {
            if (!vehiclePositions.has('P')) {
              vehiclePositions.set('P', []);
            }
            vehiclePositions.get('P').push({ row: i, col: j });
            continue;
          }
          
          if (!vehiclePositions.has(cell)) {
            vehiclePositions.set(cell, []);
          }
          vehiclePositions.get(cell).push({ row: i, col: j });
        }
      } else {
        // This is a row outside the grid (above or below)
        // Check if it contains 'K' to indicate exit at top or bottom
        const kIndex = rowLine.indexOf('K');
        if (kIndex !== -1) {
          if (exitPoint !== null) {
            throw new Error('Multiple exit points found');
          }
          // If i is 0, it's above the grid (row -1), if i is rows, it's below (row = rows)
          const exitRow = (i < rows) ? -1 : rows;
          exitPoint = { row: exitRow, col: kIndex };
        }
      }
    }
    
    if (!vehiclePositions.has('P') || vehiclePositions.get('P').length === 0) {
      throw new Error('No primary piece found');
    }
    
    if (exitPoint === null) {
      throw new Error('No exit point found');
    }
    
    const vehicles = [];
    
    for (const [id, positions] of vehiclePositions) {

      positions.sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      });
      
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
      // Verify the exit point is at the edge of the board (or now outside it) and aligned with primary piece
    const isExitPositionValid = 
      exitPoint.row === -1 || 
      exitPoint.row === rows || 
      exitPoint.col === -1 || 
      exitPoint.col === cols;
    
    if (!isExitPositionValid) {
      throw new Error('Exit point must be outside the grid (top, bottom, left, or right)');
    }
    
    // Determine the actual board cell that connects to the exit
    let exitCell;
    if (exitPoint.row === -1) {
      exitCell = { row: 0, col: exitPoint.col };  // Top edge
    } else if (exitPoint.row === rows) {
      exitCell = { row: rows - 1, col: exitPoint.col };  // Bottom edge
    } else if (exitPoint.col === -1) {
      exitCell = { row: exitPoint.row, col: 0 };  // Left edge
    } else if (exitPoint.col === cols) {
      exitCell = { row: exitPoint.row, col: cols - 1 };  // Right edge
    }
    
    const isExitAlignedWithPrimary = 
      (primaryPiece.orientation === 'horizontal' && exitCell.row === primaryPiece.positions[0].row) ||
      (primaryPiece.orientation === 'vertical' && exitCell.col === primaryPiece.positions[0].col);
    
    if (!isExitAlignedWithPrimary) {
      throw new Error('Exit point must be aligned with the primary piece');
    }
      return {
      board,
      vehicles,
      primaryPiece,
      exitPoint: exitCell  // Return the actual board cell that connects to the exit
    };
  } catch (error) {
    throw new Error(`Error parsing input: ${error.message}`);
  }
};
