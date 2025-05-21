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
K (optional exit marker)

Where:
- A, B: Board dimensions (A×B)
- N: Number of non-primary pieces
- board_configuration: The puzzle layout
  - P: Primary piece (must form a straight line)
  - K: Exit point (outside the grid)
  - .: Empty cell
  - Letters: Other vehicles (must occupy at least 2 cells in a straight line)

Exit point format options:
1. K at beginning of a row (left exit)
2. K at end of a row (right exit)
3. K on separate line above the grid (top exit)
4. K on separate line below the grid (bottom exit)
5. K with indentation on separate line (column position matters)`}
        </pre>
        <div className="example">
          <h4>Examples:</h4>
          <pre>
{`Example 1 (Right Exit):
6 6
11
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.

Example 2 (Bottom Exit):
6 6
11
AAB..F
..BCDF
GPPCDF
GH.III
GHJ...
LLJMM.
K

Example 3 (Bottom Exit with Column Alignment):
6 6
11
AAB..F
..BCDF
GPPCDF
GH.III
GHJ...
LLJMM.

    K`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PuzzleInput;
