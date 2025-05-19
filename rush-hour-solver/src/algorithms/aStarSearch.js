import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath,
  distanceToExit,
  countBlockingVehicles
} from '../utils/boardUtils';

/**
 * A* Search algorithm to solve the Rush Hour puzzle
 * @param {Object} initialState - Initial state of the puzzle
 * @returns {Object} Object containing the solution path and number of nodes visited
 */
export const solveWithAStar = (initialState) => {
  // Priority queue for frontier
  const frontier = [{ 
    state: initialState, 
    cost: 0,  // g(n): cost from start to current node
    heuristic: distanceToExit(initialState) + countBlockingVehicles(initialState), // h(n): estimated cost to goal
    f: distanceToExit(initialState) + countBlockingVehicles(initialState) // f(n) = g(n) + h(n)
  }];
  
  // Set to track explored states
  const explored = new Set();
  
  // Map to track the path
  const cameFrom = new Map();
  
  // Map to store cost from start to each state
  const gScore = new Map();
  gScore.set(boardToString(initialState.board), 0);
  
  // Counter for nodes visited
  let nodesVisited = 0;
  
  while (frontier.length > 0) {
    // Sort frontier by f value (lowest first)
    frontier.sort((a, b) => a.f - b.f);
    
    // Get the state with the lowest f value
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
      
      // Calculate tentative g score (cost from start to this neighbor)
      const tentativeGScore = cost + 1;
      
      // Check if this path is better than any previous one
      if (!gScore.has(nextStateStr) || tentativeGScore < gScore.get(nextStateStr)) {
        // Update the path
        cameFrom.set(nextStateStr, state);
        
        // Update g score
        gScore.set(nextStateStr, tentativeGScore);
        
        // Calculate heuristic for the new state
        // h(n) = distance to exit + number of blocking vehicles
        const heuristic = distanceToExit(nextState) + countBlockingVehicles(nextState);
        
        // Calculate f(n) = g(n) + h(n)
        const f = tentativeGScore + heuristic;
        
        // Check if this state is already in the frontier
        const inFrontier = frontier.findIndex(item => boardToString(item.state.board) === nextStateStr);
        
        if (inFrontier !== -1) {
          // Update the frontier if this path is better
          if (f < frontier[inFrontier].f) {
            frontier[inFrontier] = { state: nextState, cost: tentativeGScore, heuristic, f };
          }
        } else {
          // Add to frontier with f value
          frontier.push({ state: nextState, cost: tentativeGScore, heuristic, f });
        }
      }
    }
  }
  
  // No solution found
  return { path: [], nodesVisited };
};
