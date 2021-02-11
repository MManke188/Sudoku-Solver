class SudokuSolver {

  validate(puzzleString) {
    let sudokuRegex = /^[1-9\.]+$/g
    if(puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    } else if(!sudokuRegex.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' }
    } else {
      return true
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let finalRow = this.getRow(puzzleString, row, column)
    if(finalRow.includes(value) || value > 9) {
      return false
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let finalCol = this.getCol(puzzleString, row, column)

    if(finalCol.includes(value) || value > 9) {
      return false
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value, index) {
    if(index === undefined) {
      index = this.getIndex(row, column)
    }

    let finalReg = this.getRegion(puzzleString, index)
    if(finalReg.includes(value) || value > 9) {
      return false
    }
    return true
  }

  solve(puzzleString) {
    if(this.validate(puzzleString) === true) {
      let pS = puzzleString
      let ind = []
      for(let i = 0; i < 81; i++) {
        if(pS[i] == '.') {
          ind.push(i)
        }
      }

      let testSolution = pS.split('')
      let found = false
      for(let j = 0; j < ind.length; j ++) {
        for(let k = 1; k <= 9; k++) {
          while(k <= testSolution[ind[j]]) {
            k ++;
          }
          testSolution.splice(ind[j], 1, '.')

          let tS = testSolution.join('')
          let row = this.getRow(tS, 'row', 'col', ind[j])
          let col = this.getCol(tS, 'row', 'col', ind[j])
          let reg = this.getRegion(tS, ind[j])
          if(!row.includes(k) && !col.includes(k) && !reg.includes(k) && k <= 9) {
            testSolution.splice(ind[j], 1, k)
            found = true
            break;
          } else {
            found = false
          }
        }

        if(found == false) {
          if(j == 0) {
            return false
          } else {
            j -= 2
          }
        }
      }
      pS = testSolution.join('')
      return pS
    } else {
      return false
    }
  }

  getCol(string, row, col, index) {
    let result
    let columns = [
      [0,9,18,27,36,45,54,63,72],
      [1,10,19,28,37,46,55,64,73],
      [2,11,20,29,38,47,56,65,74],
      [3,12,21,30,39,48,57,66,75],
      [4,13,22,31,40,49,58,67,76],
      [5,14,23,32,41,50,59,68,77],
      [6,15,24,33,42,51,60,69,78],
      [7,16,25,34,43,52,61,70,79],
      [8,17,26,35,44,53,62,71,80]
    ]
    if(index === undefined) {
      index = this.getIndex(row, col)
    }
    

    for(let i = 0; i < columns.length; i++) {
      if (columns[i].includes(index)) {
        for(let j = 0; j < 9; j ++) {
          columns[i][j] = string[columns[i][j]]
        }
        result = columns[i].join('')
        return result
      }
    }
  }

  getRow(string, row, col, index) {
    let result
    let rows = [
      [0,1,2,3,4,5,6,7,8],
      [9,10,11,12,13,14,15,16,17],
      [18,19,20,21,22,23,24,25,26],
      [27,28,29,30,31,32,33,34,35],
      [36,37,38,39,40,41,42,43,44],
      [45,46,47,48,49,50,51,52,53],
      [54,55,56,57,58,59,60,61,62],
      [63,64,65,66,67,68,69,70,71],
      [72,73,74,75,76,77,78,79,80]
    ]
    if(index === undefined) {
      index = this.getIndex(row, col)
    }

    for(let i = 0; i < rows.length; i++) {
      if (rows[i].includes(index)) {
        for(let j = 0; j < 9; j ++) {
          rows[i][j] = string[rows[i][j]]
        }
        result = rows[i].join('')
        return result
      }
    }
  }

  getRegion(string, index) {
    let result
    let regions = [
      [0,1,2,9,10,11,18,19,20],
      [3,4,5,12,13,14,21,22,23],
      [6,7,8,15,16,17,24,25,26],
      [27,28,29,36,37,38,45,46,47],
      [30,31,32,39,40,41,48,49,50],
      [33,34,35,42,43,44,51,52,53],
      [54,55,56,63,64,65,72,73,74],
      [57,58,59,66,67,68,75,76,77],
      [60,61,62,69,70,71,78,79,80]
    ]

    for(let i = 0; i < regions.length; i++) {
      if (regions[i].includes(index)) {
        for(let j = 0; j < 9; j ++) {
          regions[i][j] = string[regions[i][j]]
        }
        result = regions[i].join('')
        return result
      }
    }
  }

  getIndex(row, col) {
    let index = 9 * (col - 1) - 1
    switch(row) {
      case 'A':
        index += 1
        break;
      case 'B':
        index += 2
        break;
      case 'C':
        index += 3
        break;
      case 'D':
        index += 4
        break;
      case 'E':
        index += 5
        break;
      case 'F':
        index += 6
        break;
      case 'G':
        index += 7
        break;
      case 'H':
        index += 8
        break;
    }
    return index;
  }
}

module.exports = SudokuSolver;