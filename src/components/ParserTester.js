import React, { useEffect, useState } from 'react';
import { parseInput } from '../utils/puzzleParser';


function ParserTester() {
  const [testResults, setTestResults] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {

    const testFiles = [
      '/test_case1.txt',
      '/test_case2.txt',
      '/test_case3.txt',
    ];

    const runTestFile = async (file) => {
      try {
        const response = await fetch(file);
        const content = await response.text();
        
        try {
          const result = parseInput(content);
          setTestResults(prev => [...prev, {
            file,
            success: true,
            message: `Successfully parsed file: ${file}`
          }]);
          console.log(`Successfully parsed ${file}:`, result);
        } catch (error) {
          setTestResults(prev => [...prev, {
            file,
            success: false,
            message: `Error parsing file: ${file} - ${error.message}`
          }]);
          setErrorMessages(prev => [...prev, `Error parsing ${file}: ${error.message}`]);
          console.error(`Error parsing ${file}:`, error);
        }
      } catch (error) {
        setTestResults(prev => [...prev, {
          file,
          success: false,
          message: `Error loading file: ${file} - ${error.message}`
        }]);
        setErrorMessages(prev => [...prev, `Error loading ${file}: ${error.message}`]);
        console.error(`Error loading ${file}:`, error);
      }
    };

    // Run tests for each file
    testFiles.forEach(file => runTestFile(file));
  }, []);

  return (
    <div className="parser-test">
      <h2>Parser Test Results</h2>
      <div className="test-results">
        {testResults.map((result, index) => (
          <div key={index} className={`test-result ${result.success ? 'success' : 'error'}`}
               style={{ color: result.success ? 'green' : 'red', margin: '10px 0' }}>
            {result.message}
          </div>
        ))}
      </div>
      
      {errorMessages.length > 0 && (
        <div className="error-messages">
          <h3>Errors:</h3>
          {errorMessages.map((error, index) => (
            <div key={index} className="error-message" style={{ color: 'red' }}>
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParserTester;
