import "./App.css";
import { useState } from "react";

const initial = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
];

function App() {
  const [sudokuArr, setSudokuArr] = useState(initial);

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1,
      grid = getDeepCopy(sudokuArr);
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setSudokuArr(grid);
  }
  //Function to generate random sudoku//
  function resetSudoku(numberOfFilledCells) {
    const sudoku = Array.from({ length: 9 }, () => Array(9).fill(-1));
    solver(sudoku); // Solve the puzzle to get a solution

    // Function to randomly remove numbers from the solved puzzle
    function createPuzzle(solution, numberOfFilledCells) {
      const puzzle = getDeepCopy(solution);

      for (let i = 0; i < numberOfFilledCells; i++) {
        let row, col;
        do {
          row = Math.floor(Math.random() * 9);
          col = Math.floor(Math.random() * 9);
        } while (puzzle[row][col] === -1);

        puzzle[row][col] = -1; // Remove number
      }

      return puzzle;
    }

    const puzzle = createPuzzle(sudoku, numberOfFilledCells);
    setSudokuArr(puzzle);
  }

  // Helper function to check if a puzzle is valid
  function isValidPuzzle(grid) {
    const usedNumbers = new Set();

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
      usedNumbers.clear();

      for (let j = 0; j < 9; j++) {
        const numRow = grid[i][j];
        const numCol = grid[j][i];

        if (usedNumbers.has(numRow) || usedNumbers.has(numCol)) {
          return false;
        }

        usedNumbers.add(numRow);
        usedNumbers.add(numCol);
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        usedNumbers.clear();

        for (let i = boxRow; i < boxRow + 3; i++) {
          for (let j = boxCol; j < boxCol + 3; j++) {
            const num = grid[i][j];

            if (usedNumbers.has(num)) {
              return false;
            }

            usedNumbers.add(num);
          }
        }
      }
    }

    return true;
  }


  //Function to check sudoku//
  function checkSudoku() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const inputtedValue = sudokuArr[row][col];
        const solvedValue = sudoku[row][col];

        if (inputtedValue !== -1 && inputtedValue !== solvedValue) {
          alert(
            `Incorrect value at row ${row + 1}, column ${
              col + 1
            }. Please retry.`
          );
          return;
        }
      }
    }

    alert("Congratulations! Sudoku is correct.");
  }

  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  function checkCol(grid, col, num) {
    return grid.map((row) => row[col]).indexOf(num) === -1;
  }

  function checkBox(grid, row, col, num) {
    let boxArr = [],
      rowStart = row - (row % 3),
      colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }
    return boxArr.indexOf(num) === -1;
  }

  function checkValid(grid, row, col, num) {
    //num should be unique in row and coloumn//
    if (
      checkRow(grid, row, num) &&
      checkCol(grid, col, num) &&
      checkBox(grid, row, col, num)
    ) {
      return true;
    }
    return false;
  }

  // function getNext(row, col) {
  //   return col !== 8 ? [row, col + 1] : row != 8 ? [row + 1, 0] : [0, 0];
  // }

  //Recursive function to solve sudoku//
  function solver(grid, row = 0, col = 0) {
    if (row === 8 && col === 9) {
      return true;
    }

    if (col === 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] !== -1) {
      return solver(grid, row, col + 1);
    }

    for (let num = 1; num <= 9; num++) {
      if (checkValid(grid, row, col, num)) {
        grid[row][col] = num;

        if (solver(grid, row, col + 1)) {
          return true;
        }

        grid[row][col] = -1; // Backtrack
      }
    }

    return false;
  }

  //Function to solve sudoku//
  function solveSudoku() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    setSudokuArr(sudoku);
  }


  return (
    <div className="App">
      <div className="App-header">
        <h3>Sudoku Solver</h3>
        <table>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
              return (
                <tr
                  key={rIndex}
                  className={(row + 1) % 3 === 0 ? "bBorder" : " "}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                    return (
                      <td
                        key={rIndex + cIndex}
                        className={(col + 1) % 3 === 0 ? "rBorder" : " "}
                      >
                        <input
                          onChange={(e) => onInputChange(e, row, col)}
                          value={
                            sudokuArr[row][col] === -1
                              ? " "
                              : sudokuArr[row][col]
                          }
                          className="cellInput"
                          disabled={initial[row][col] !== -1}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="buttonContainer">
          <button className="checkButton" onClick={checkSudoku}>
            Check
          </button>
          <button className="solveButton" onClick={solveSudoku}>
            Solve
          </button>
          <button className="resetButton" onClick={() => resetSudoku(20)}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;
