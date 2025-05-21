import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath
} from '../utils/boardUtils';

export const solveWithUCS = (initialState) => {
  const frontier = [{ state: initialState, cost: 0 }];
  
  const explored = new Set();
  
  const cameFrom = new Map();
  
  let nodesVisited = 0;
  
  while (frontier.length > 0) {
    frontier.sort((a, b) => a.cost - b.cost);
    const { state, cost } = frontier.shift();
    nodesVisited++;
    
    if (isSolved(state)) {
      console.log("Solution found:", state);
      const path = reconstructPath(cameFrom, state);
      console.log("Path found with length:", path.length);
      console.log("First step in path:", path[0]);
      console.log("Last step in path:", path[path.length - 1]);
      return {
        path: path,
        nodesVisited
      };
    }
    
    const stateStr = boardToString(state.board);
    
    if (explored.has(stateStr)) continue;
    
    explored.add(stateStr);
    
    const possibleMoves = getPossibleMoves(state);
    
    for (const nextState of possibleMoves) {
      const nextStateStr = boardToString(nextState.board);
      
      if (!explored.has(nextStateStr)) {
        frontier.push({ state: nextState, cost: cost + 1 });
        
        cameFrom.set(nextStateStr, state);
      }
    }
  }
  
  return { path: [], nodesVisited };
};
