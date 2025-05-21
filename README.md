# Rush Hour Puzzle Solver

A web application that solves Rush Hour puzzles using pathfinding algorithms.

## Description

Rush Hour is a sliding block puzzle game where the goal is to move a special vehicle (the primary piece) out of a grid through an exit point. This application implements three pathfinding algorithms to solve Rush Hour puzzles:

1. Uniform Cost Search (UCS)
2. Greedy Best First Search
3. A* Search

## Features

- Upload puzzle configurations from text files
- Select from three different pathfinding algorithms
- Choose from multiple heuristic functions for informed searches
- Visualize the solution with an animated board
- Display performance metrics (execution time, nodes visited)
- Step-by-step solution walkthrough

## Algorithms Implemented

### Uniform Cost Search (UCS)
- Guarantees the shortest path solution
- Treats all moves as having equal cost (1)
- Explores states in order of path cost

### Greedy Best First Search
- Uses selectable heuristics to guide the search
- Faster than UCS but doesn't guarantee shortest path
- Always chooses the state that appears closest to the goal

### A* Search
- Combines UCS and Greedy Best First Search
- Uses both path cost and heuristic: f(n) = g(n) + h(n)
- Multiple heuristic options available
- Guarantees shortest path if heuristic is admissible

## Heuristic Functions

The application provides several heuristic functions that can be selected by the user:

### Distance to Exit
- Measures how far the primary piece is from the exit
- Simple but effective for many puzzles

### Blocking Vehicles
- Counts the number of vehicles blocking the path to the exit
- Works well when the primary piece is already close to the exit

### Combined (Distance + Blocking)
- Combines distance and blocking vehicles count
- Generally more effective than either heuristic alone

### Path Complexity
- Advanced heuristic that considers how difficult it is to clear the path
- Accounts for both direct blockers and vehicles blocking those blockers
- May provide better performance on complex puzzles

## Project Structure

```
project-rush-hour/
├── public/             # Public assets and test cases
│   ├── index.html
│   ├── manifest.json
│   └── test_case_*.txt # Various test cases
├── src/                # Source code
│   ├── algorithms/     # Pathfinding algorithms
│   │   ├── aStarSearch.js
│   │   ├── greedyBestFirst.js
│   │   └── uniformCostSearch.js
│   ├── components/     # React components
│   │   ├── Board.js
│   │   ├── Controls.js
│   │   ├── ParserTester.js
│   │   ├── PuzzleInput.js
│   │   └── SolutionDisplay.js
│   ├── utils/          # Utility functions
│   │   ├── boardUtils.js
│   │   ├── heuristicFunctions.js
│   │   └── puzzleParser.js
│   ├── App.js          # Main application component
│   └── index.js        # React entry point
└── package.json        # Project dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/project-rush-hour.git
cd project-rush-hour
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Input File Format

The application accepts text files with the following format:

```
<rows> <cols>
<number_of_vehicles>
<primary_piece_identifier>
<grid_row_1>
<grid_row_2>
...
<grid_row_n>
```

Example:
```
6 6
11
K
AAB..F
..BCDF
GPPCDF
GH.III
GHJ...
LLJMM.
```

- First line: Board dimensions (rows and columns)
- Second line: Number of vehicles on the board
- Third line: Primary piece identifier (usually 'K')
- Remaining lines: The grid representation

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Puzzle Format

The input file must adhere to the following format:

```
A B
N
board_configuration
K_position
```

Where:
- **A, B**: Board dimensions (A×B)
- **N**: Number of non-primary pieces
- **board_configuration**: The puzzle layout where:
  - **P**: Primary piece
  - **.**: Empty cell
  - **Letters**: Other vehicles
- **K_position**: Position of the exit marker 'K' which must be outside the grid

### Example

```
6 6
11
AAB..F
..BCDF
GPPCDF
GH.III
GHJ...
LLJMM.
K
```

In this example:
- The board is 6×6
- There are 11 vehicles (including the primary piece 'P')
- The exit point 'K' is placed to the left of the grid, aligned with the third row
- The primary piece 'P' is positioned horizontally in the third row

The exit point ('K') can be placed:
- At the left of a row (like in the example)
- At the right of a row (e.g., "AABB.." followed by "K" on the same line)
- Above a column (e.g., "K" placed above the grid, aligned with a column)
- Below a column (e.g., "K" placed below the grid, aligned with a column)

## Algorithms Implementation

### Uniform Cost Search (UCS)
UCS explores board states in order of the number of moves made, ensuring the solution found has the minimum number of moves.

### Greedy Best First Search
This algorithm prioritizes states that appear closer to the goal based on a heuristic function (distance to exit), potentially finding solutions faster but not guaranteeing optimality.

### A* Search
A* combines UCS and Greedy approaches by considering both the cost so far (moves made) and a heuristic estimate of the remaining cost, balancing optimality with efficiency.