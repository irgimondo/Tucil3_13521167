import React, { useState } from 'react';
import './SolutionDisplay.css';
import Board from './Board';

const SolutionDisplay = ({ solution, board, vehicles, primaryPiece, exitPoint, onAnimate }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500); 
  
  if (!solution || solution.length === 0) {
    return null;
  }

  const startAnimation = () => {
    if (isAnimating) return;
    
    setCurrentStepIndex(0);
    setIsAnimating(true);
    onAnimate(true);

    const animate = (index) => {
      if (index >= solution.length) {
        setIsAnimating(false);
        onAnimate(false);
        return;
      }

      setCurrentStepIndex(index);
      
      setTimeout(() => {
        animate(index + 1);
      }, animationSpeed);
    };

    animate(0);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    onAnimate(false);
  };

  const handleSpeedChange = (e) => {
    setAnimationSpeed(1000 - e.target.value); 
  };

  const totalMoves = solution.length - 1;
  
  return (
    <div className="solution-display">
      <h2>Solution</h2>
      
      <div className="solution-info">
        <p>Total moves: {totalMoves}</p>
        <p>Current move: {isAnimating ? currentStepIndex : 0} / {totalMoves}</p>
      </div>
      
      <div className="animation-controls">
        <button 
          className="animation-button"
          onClick={startAnimation}
          disabled={isAnimating}
        >
          Play Animation
        </button>
        
        <button 
          className="animation-button stop"
          onClick={stopAnimation}
          disabled={!isAnimating}
        >
          Stop
        </button>
        
        <div className="speed-control">
          <span>Slow</span>
          <input
            type="range"
            min="100"
            max="900"
            value={1000 - animationSpeed}
            onChange={handleSpeedChange}
            disabled={isAnimating}
          />
          <span>Fast</span>
        </div>
      </div>
      
      <div className="solution-board">
        <Board 
          board={board}
          vehicles={vehicles}
          primaryPiece={primaryPiece}
          exitPoint={exitPoint}
          isAnimating={isAnimating}
          currentStep={solution[currentStepIndex]}
        />
      </div>
      
      <div className="solution-steps">
        <h3>Move Sequence</h3>
        <div className="steps-list">
          {solution.slice(1).map((step, index) => (
            <div 
              key={index} 
              className={`step ${currentStepIndex === index + 1 ? 'current-step' : ''}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-description">
                Move {step.movedVehicle} {step.direction}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionDisplay;
