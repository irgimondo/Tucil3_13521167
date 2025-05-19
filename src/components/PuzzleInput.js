import React from 'react';
import './PuzzleInput.css';

const PuzzleInput = ({ onFileUpload, fileInputRef }) => {
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="puzzle-input">
      <h2>Upload Puzzle</h2>
      <p className="input-instructions">
        Upload a text file with the Rush Hour puzzle configuration.
      </p>
      
      <div className="file-upload">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={onFileUpload}
          style={{ display: 'none' }}
          id="puzzle-file-input"
        />
        <button 
          className="upload-button"
          onClick={handleButtonClick}
        >
          Select File
        </button>
        <span className="file-format">
          (.txt format)
        </span>
      </div>
      
      <div className="file-format-info">
        <h3>Expected File Format</h3>
        <pre>
{`A B
N
board_configuration

Where:
- A, B: Board dimensions (A×B)
- N: Number of non-primary pieces
- board_configuration: The puzzle layout
  - P: Primary piece
  - K: Exit point
  - .: Empty cell
  - Letters: Other vehicles`}
        </pre>
        <div className="example">
          <h4>Example:</h4>
          <pre>
{`6 6
11
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PuzzleInput;
