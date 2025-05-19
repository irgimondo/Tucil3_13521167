import React from 'react';
import './Controls.css';

const Controls = ({ onAlgorithmChange, onSolve, selectedAlgorithm, disabled }) => {
  const handleAlgorithmChange = (e) => {
    onAlgorithmChange(e.target.value);
  };

  return (
    <div className="controls">
      <h2>Algorithm Selection</h2>
      <div className="algorithm-selection">
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              value="ucs"
              checked={selectedAlgorithm === 'ucs'}
              onChange={handleAlgorithmChange}
              disabled={disabled}
            />
            <span>Uniform Cost Search (UCS)</span>
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              value="greedy"
              checked={selectedAlgorithm === 'greedy'}
              onChange={handleAlgorithmChange}
              disabled={disabled}
            />
            <span>Greedy Best First Search</span>
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              value="astar"
              checked={selectedAlgorithm === 'astar'}
              onChange={handleAlgorithmChange}
              disabled={disabled}
            />
            <span>A* Search</span>
          </label>
        </div>
      </div>
      
      <div className="heuristic-info">
        <h3>Heuristics Used</h3>
        <p>
          <strong>Greedy Best First:</strong> Distance of primary piece to exit
        </p>
        <p>
          <strong>A*:</strong> Distance to exit + number of blocking vehicles
        </p>
      </div>

      <button 
        className="solve-button" 
        onClick={onSolve}
        disabled={disabled}
      >
        Solve Puzzle
      </button>
    </div>
  );
};

export default Controls;
