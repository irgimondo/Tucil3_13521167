import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath
} from '../utils/boardUtils';

/**
 * Uniform Cost Search (UCS) algorithm to solve the Rush Hour puzzle
 * @param {Object} initialState - Initial state of the puzzle
 * @returns {Object} Object containing the solution path and number of nodes visited
 */
export const solveWithUCS = (initialState) => {
  // Priority queue for frontier
  const frontier = [{ state: initialState, cost: 0 }];
  
  // Set to track explored states
  const explored = new Set();
  
  // Map to track the path
  const cameFrom = new Map();
  
  // Counter for nodes visited
  let nodesVisited = 0;
  
  while (frontier.length > 0) {
    // Sort frontier by cost (for UCS, cost is just the depth/moves)
    frontier.sort((a, b) => a.cost - b.cost);
    
    // Get the state with the lowest cost
    const { state, cost } = frontier.shift();
    nodesVisited++;
    
    // Check if we've reached the goal
    if (isSolved(state)) {
      return {
        path: reconstructPath(cameFrom, state),
        nodesVisited
      };
    }
    
    // Generate a string representation of the state for comparison
    const stateStr = boardToString(state.board);
    
    // Skip if we've already explored this state
    if (explored.has(stateStr)) continue;
    
    // Mark the state as explored
    explored.add(stateStr);
    
    // Get all possible moves from the current state
    const possibleMoves = getPossibleMoves(state);
    
    // Add new states to the frontier
    for (const nextState of possibleMoves) {
      const nextStateStr = boardToString(nextState.board);
      
      if (!explored.has(nextStateStr)) {
        // Add to frontier with incremented cost
        frontier.push({ state: nextState, cost: cost + 1 });
        
        // Update path
        cameFrom.set(nextStateStr, state);
      }
    }
  }
  
  // No solution found
  return { path: [], nodesVisited };
};
