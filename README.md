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
- Visualize the solution with an animated board
- Display performance metrics (execution time, nodes visited)
- Step-by-step solution walkthrough

## Heuristics

- **Greedy Best First Search**: Distance of the primary piece to the exit
- **A* Search**: Distance to exit + number of blocking vehicles

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn

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
```

Where:
- **A, B**: Board dimensions (A×B)
- **N**: Number of non-primary pieces
- **board_configuration**: The puzzle layout where:
  - **P**: Primary piece
  - **K**: Exit point
  - **.**: Empty cell
  - **Letters**: Other vehicles

### Example

```
6 6
11
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.
```

## Algorithms Implementation

### Uniform Cost Search (UCS)
UCS explores board states in order of the number of moves made, ensuring the solution found has the minimum number of moves.

### Greedy Best First Search
This algorithm prioritizes states that appear closer to the goal based on a heuristic function (distance to exit), potentially finding solutions faster but not guaranteeing optimality.

### A* Search
A* combines UCS and Greedy approaches by considering both the cost so far (moves made) and a heuristic estimate of the remaining cost, balancing optimality with efficiency.

## Project Structure

```
rush-hour-solver/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── sample_test.txt
├── src/
│   ├── algorithms/
│   │   ├── aStarSearch.js
│   │   ├── greedyBestFirst.js
│   │   └── uniformCostSearch.js
│   ├── components/
│   │   ├── Board.js
│   │   ├── Board.css
│   │   ├── Controls.js
│   │   ├── Controls.css
│   │   ├── PuzzleInput.js
│   │   ├── PuzzleInput.css
│   │   ├── SolutionDisplay.js
│   │   └── SolutionDisplay.css
│   ├── utils/
│   │   ├── boardUtils.js
│   │   └── inputParser.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```