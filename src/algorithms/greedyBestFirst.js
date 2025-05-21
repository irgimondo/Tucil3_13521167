
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


export const solveWithGreedyBestFirst = (initialState, heuristicType = 'combined') => {

  const initialHeuristic = calculateHeuristic(initialState, heuristicType);
  const frontier = [{ state: initialState, heuristic: initialHeuristic }];
  
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
        const heuristic = calculateHeuristic(nextState, heuristicType);
        
        frontier.push({ state: nextState, heuristic });
        
        cameFrom.set(nextStateStr, state);
      }
    }
  }
  
  return { path: [], nodesVisited };
};
