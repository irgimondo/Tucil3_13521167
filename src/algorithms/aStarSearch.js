import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath,
  distanceToExit,
  countBlockingVehicles
} from '../utils/boardUtils';


export const solveWithAStar = (initialState) => {

  const frontier = [{ 
    state: initialState, 
    cost: 0,  
    heuristic: distanceToExit(initialState) + countBlockingVehicles(initialState), 
    f: distanceToExit(initialState) + countBlockingVehicles(initialState) 
  }];
  
  const explored = new Set();
  
  const cameFrom = new Map();
  
  const gScore = new Map();
  gScore.set(boardToString(initialState.board), 0);
  
  let nodesVisited = 0;
  
  while (frontier.length > 0) {
    frontier.sort((a, b) => a.f - b.f);
    
    const { state, cost } = frontier.shift();
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
      
      const tentativeGScore = cost + 1;
      
      if (!gScore.has(nextStateStr) || tentativeGScore < gScore.get(nextStateStr)) {
        cameFrom.set(nextStateStr, state);
        
        gScore.set(nextStateStr, tentativeGScore);
        
        const heuristic = distanceToExit(nextState) + countBlockingVehicles(nextState);
        
        const f = tentativeGScore + heuristic;
        
        const inFrontier = frontier.findIndex(item => boardToString(item.state.board) === nextStateStr);
        
        if (inFrontier !== -1) {

          if (f < frontier[inFrontier].f) {
            frontier[inFrontier] = { state: nextState, cost: tentativeGScore, heuristic, f };
          }
        } else {

          frontier.push({ state: nextState, cost: tentativeGScore, heuristic, f });
        }
      }
    }
  }
  
  return { path: [], nodesVisited };
};
