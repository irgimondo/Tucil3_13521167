
import {
  boardToString,
  getPossibleMoves,
  isSolved,
  reconstructPath,
  distanceToExit,
  countBlockingVehicles
} from '../utils/boardUtils';

import {
  pathComplexity,
  combinedHeuristic
} from '../utils/heuristicFunctions';

const calculateHeuristic = (state, heuristicType) => {
  switch (heuristicType) {
    case 'distance':
      return distanceToExit(state);
    case 'blocking':
      return countBlockingVehicles(state);
    case 'pathComplexity':
      return pathComplexity(state);
    case 'combined':
    default:
      return combinedHeuristic(state);
  }
};

export const solveWithAStar = (initialState, heuristicType = 'combined') => {

  const initialHeuristic = calculateHeuristic(initialState, heuristicType);
  const frontier = [{ 
    state: initialState, 
    cost: 0,  
    heuristic: initialHeuristic, 
    f: initialHeuristic 
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
        
        const heuristic = calculateHeuristic(nextState, heuristicType);
        const f = tentativeGScore + heuristic;
        
        if (!explored.has(nextStateStr)) {
          frontier.push({ 
            state: nextState, 
            cost: tentativeGScore,
            heuristic: heuristic,
            f: f
          });
        }
      }
    }
  }
  
  // No solution found
  return { path: [], nodesVisited };
};
