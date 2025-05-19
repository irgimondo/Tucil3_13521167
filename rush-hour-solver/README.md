# Rush Hour Puzzle Solver

This is a React-based web application that solves Rush Hour puzzles using different pathfinding algorithms.

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build
```

## Usage Instructions

1. Upload a puzzle configuration file (.txt format)
2. Select a pathfinding algorithm:
   - Uniform Cost Search (UCS)
   - Greedy Best First Search
   - A* Search
3. Click "Solve Puzzle" to find a solution
4. View the animated solution and performance metrics

## Puzzle File Format

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
  - **P**: Primary piece (the piece to be moved to the exit)
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

## Implemented Algorithms

### Uniform Cost Search (UCS)
- Guarantees optimal solutions (minimum number of moves)
- Explores states in order of the number of moves made

### Greedy Best First Search
- Uses a heuristic (distance to exit) to guide the search
- Faster but not guaranteed to find optimal solutions

### A* Search
- Combines UCS and Greedy approaches
- Uses f(n) = g(n) + h(n) where:
  - g(n): Number of moves made so far
  - h(n): Heuristic (distance to exit + number of blocking vehicles)

## Implementation Details

The application uses:
- React for the user interface
- Custom pathfinding algorithm implementations
- Interactive visualization of the solution
