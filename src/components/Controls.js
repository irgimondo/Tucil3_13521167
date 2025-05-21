import React, { useState } from 'react';
import './Controls.css';

const Controls = ({ onAlgorithmChange, onHeuristicChange, onSolve, selectedAlgorithm, selectedHeuristic, disabled }) => {
  const handleAlgorithmChange = (e) => {
    onAlgorithmChange(e.target.value);
  };
  
  const handleHeuristicChange = (e) => {
    onHeuristicChange(e.target.value);
  };

  const showHeuristicSelection = selectedAlgorithm === 'greedy' || selectedAlgorithm === 'astar';

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
      
      {showHeuristicSelection && (
        <div className="heuristic-selection">
          <h3>Select Heuristic</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="distance"
                checked={selectedHeuristic === 'distance'}
                onChange={handleHeuristicChange}
                disabled={disabled}
              />
              <span>Distance to Exit</span>
            </label>
            
            <label className="radio-label">
              <input
                type="radio"
                value="blocking"
                checked={selectedHeuristic === 'blocking'}
                onChange={handleHeuristicChange}
                disabled={disabled}
              />
              <span>Blocking Vehicles</span>
            </label>
              <label className="radio-label">
              <input
                type="radio"
                value="combined"
                checked={selectedHeuristic === 'combined'}
                onChange={handleHeuristicChange}
                disabled={disabled}
              />
              <span>Combined (Distance + Blocking)</span>
            </label>
            
            <label className="radio-label">
              <input
                type="radio"
                value="pathComplexity"
                checked={selectedHeuristic === 'pathComplexity'}
                onChange={handleHeuristicChange}
                disabled={disabled}
              />
              <span>Path Complexity</span>
            </label>
          </div>
        </div>
      )}
        <div className="heuristic-info">
        <h3>Heuristics Explanation</h3>
        <p>
          <strong>Distance to Exit:</strong> Measures how far the primary piece is from the exit
        </p>
        <p>
          <strong>Blocking Vehicles:</strong> Counts vehicles blocking the path to the exit
        </p>
        <p>
          <strong>Combined:</strong> Distance to exit + number of blocking vehicles
        </p>
        <p>
          <strong>Path Complexity:</strong> Advanced heuristic that considers how difficult it is to clear blocking vehicles
        </p>      </div>

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
