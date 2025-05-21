import React, { useState, useRef } from 'react';
import './App.css';
import Board from './components/Board';
import Controls from './components/Controls';
import PuzzleInput from './components/PuzzleInput';
import SolutionDisplay from './components/SolutionDisplay';
import ParserTester from './components/ParserTester';
import { parseInput } from './utils/puzzleParser';
import { solveWithUCS } from './algorithms/uniformCostSearch';
import { solveWithGreedyBestFirst } from './algorithms/greedyBestFirst';
import { solveWithAStar } from './algorithms/aStarSearch';

function App() { 
  const [board, setBoard] = useState(null);
  const [primaryPiece, setPrimaryPiece] = useState(null);
  const [exitPoint, setExitPoint] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [solution, setSolution] = useState(null);  const [selectedAlgorithm, setSelectedAlgorithm] = useState('ucs');
  const [selectedHeuristic, setSelectedHeuristic] = useState('distance');
  const [isAnimating, setIsAnimating] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [nodesVisited, setNodesVisited] = useState(null);
  const [error, setError] = useState(null);
  const [showParserTest, setShowParserTest] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { 
          board: parsedBoard, 
          vehicles: parsedVehicles, 
          primaryPiece: parsedPrimaryPiece,
          exitPoint: parsedExitPoint
        } = parseInput(e.target.result);
        
        setBoard(parsedBoard);
        setVehicles(parsedVehicles);
        setPrimaryPiece(parsedPrimaryPiece);
        setExitPoint(parsedExitPoint);
        
        setSolution(null);
        setExecutionTime(null);
        setNodesVisited(null);
        setError(null);
      } catch (err) {
        setError("Error parsing input file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleAlgorithmChange = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleHeuristicChange = (heuristic) => {
    setSelectedHeuristic(heuristic);
  };

  const solvePuzzle = () => {
    if (!board || !primaryPiece || !exitPoint) {
      setError("Please upload a valid puzzle configuration first.");
      return;
    }

    setError(null);
    const startTime = performance.now();
    let result;

    try {
      const initialState = {
        board: board,
        vehicles: vehicles,
        primaryPiece: primaryPiece,
        exitPoint: exitPoint
      };      
      switch (selectedAlgorithm) {
        case 'ucs':
          result = solveWithUCS(initialState);
          break;
        case 'greedy':
          result = solveWithGreedyBestFirst(initialState, selectedHeuristic);
          break;
        case 'astar':
          result = solveWithAStar(initialState, selectedHeuristic);
          break;
        default:
          result = solveWithUCS(initialState);
      }

      
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));
      setNodesVisited(result.nodesVisited);
      setSolution(result.path);
    } catch (err) {
      setError("Error solving puzzle: " + err.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rush Hour Puzzle Solver</h1>
        <button 
          onClick={() => setShowParserTest(!showParserTest)} 
          style={{ padding: '8px 16px' }}
        >
          {showParserTest ? 'Hide Parser Tests' : 'Show Parser Tests'}
        </button>
      </header>
      
      {showParserTest && (
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <ParserTester />
        </div>
      )}

      <main className="app-main">
        <div className="app-controls">
          <PuzzleInput 
            onFileUpload={handleFileUpload} 
            fileInputRef={fileInputRef} 
          />          <Controls 
            onAlgorithmChange={handleAlgorithmChange}
            onHeuristicChange={handleHeuristicChange}
            onSolve={solvePuzzle}
            selectedAlgorithm={selectedAlgorithm}
            selectedHeuristic={selectedHeuristic}
            disabled={!board}
          />          {error && <div className="error-message">{error}</div>}
          {executionTime && nodesVisited && (
            <div className="metrics">
              <p><strong>Execution Time:</strong> {executionTime} ms</p>
              <p><strong>Nodes Visited:</strong> {nodesVisited}</p>              {selectedAlgorithm !== 'ucs' && (
                <p><strong>Heuristic Used:</strong> {
                  selectedHeuristic === 'distance' ? 'Distance to Exit' :
                  selectedHeuristic === 'blocking' ? 'Blocking Vehicles' :
                  selectedHeuristic === 'pathComplexity' ? 'Path Complexity' :
                  'Combined (Distance + Blocking)'
                }</p>
              )}
            </div>
          )}
        </div>

        <div className="app-board-solution">
          <div className="board-container">
            {board ? (
              <Board 
                board={board} 
                vehicles={vehicles} 
                primaryPiece={primaryPiece}
                exitPoint={exitPoint}
                isAnimating={isAnimating}
                currentStep={null}
              />
            ) : (
              <div className="empty-board">
                <p>Please upload a puzzle configuration to start.</p>
              </div>
            )}
          </div>

          {solution && (
            <SolutionDisplay 
              solution={solution}
              board={board}
              vehicles={vehicles}
              primaryPiece={primaryPiece}
              exitPoint={exitPoint}
              setIsAnimating={setIsAnimating}
            />
          )}
        </div>
      </main>
      <footer className="app-footer">
        <p>Rush Hour Solver using UCS, Greedy Best First Search, and A* algorithms</p>
      </footer>
    </div>
  );
}

export default App;
