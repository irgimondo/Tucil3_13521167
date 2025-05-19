import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath,
  distanceToExit
} from '../utils/boardUtils';

/**
 * Greedy Best First Search algorithm to solve the Rush Hour puzzle
 * @param {Object} initialState - Initial state of the puzzle
 * @returns {Object} Object containing the solution path and number of nodes visited
 */
export const solveWithGreedyBestFirst = (initialState) => {
  // Priority queue for frontier
  const frontier = [{ state: initialState, heuristic: distanceToExit(initialState) }];
  
  // Set to track explored states
  const explored = new Set();
  
  // Map to track the path
  const cameFrom = new Map();
  
  // Counter for nodes visited
  let nodesVisited = 0;
  
  while (frontier.length > 0) {
    // Sort frontier by heuristic value (estimated distance to goal)
    frontier.sort((a, b) => a.heuristic - b.heuristic);
    
    // Get the state with the lowest heuristic value
    const { state } = frontier.shift();
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
        // Calculate heuristic for the new state
        const heuristic = distanceToExit(nextState);
        
        // Add to frontier with heuristic value
        frontier.push({ state: nextState, heuristic });
        
        // Update path
        cameFrom.set(nextStateStr, state);
      }
    }
  }
  
  // No solution found
  return { path: [], nodesVisited };
};
