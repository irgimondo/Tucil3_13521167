import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath,
  distanceToExit
} from '../utils/boardUtils';

export const solveWithGreedyBestFirst = (initialState) => {
  const frontier = [{ state: initialState, heuristic: distanceToExit(initialState) }];
  
  const explored = new Set();
  
  const cameFrom = new Map();
  
  let nodesVisited = 0;
  
  while (frontier.length > 0) {

    frontier.sort((a, b) => a.heuristic - b.heuristic);
    
    const { state } = frontier.shift();
    nodesVisited++;
    
    if (isSolved(state)) {
      return {
        path: reconstructPath(cameFrom, state),
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
        const heuristic = distanceToExit(nextState);
        
        frontier.push({ state: nextState, heuristic });
        
        cameFrom.set(nextStateStr, state);
      }
    }
  }
  
  return { path: [], nodesVisited };
};
