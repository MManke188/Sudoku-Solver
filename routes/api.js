'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let coord = req.body.coordinate
      let coordRegex = /[a-i][1-9]/i
      let val = req.body.value
      let check
      let responseObject = {}


      if(!puzzle || !coord || !val) {
        res.send({ error: 'Required field(s) missing' })
      } else if(solver.validate(puzzle) !== true){
          res.send(solver.validate(puzzle))
      } else if(!coordRegex.test(coord)) {
        res.send({ error: 'Invalid coordinate'})
      } else if(val > 9 || val < 1 || val != parseInt(val)) {
        res.send({ error: 'Invalid value' })
      } else {
        let row = coord[0]
        let col = coord[1]
        let cond1 = solver.checkRowPlacement(puzzle, row, col, val)
        let cond2 = solver.checkColPlacement(puzzle, row, col, val)
        let cond3 = solver.checkRegionPlacement(puzzle, row, col, val)

        if(cond1 && cond2 && cond3) {
          check = true
          responseObject['valid'] = check
        } else {
          check = false
          responseObject['valid'] = check
          responseObject['conflict'] = []
          if(!cond1) {
            responseObject.conflict.push('row')
          }
          if(!cond2) {
            responseObject.conflict.push('column')
          }
          if(!cond3) {
            responseObject.conflict.push('region')
          }
        }
        res.send(responseObject)
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle

      if(!puzzle) {
        res.send({ error: 'Required field missing' })
      } else if(solver.validate(puzzle) === true){
        let solved = solver.solve(puzzle)
        if(solved) {
          res.json({solution: solved})
        } else {
          res.send({ error: 'Puzzle cannot be solved' })
        }
        
      } else {
        res.send(solver.validate(puzzle))
      }
    });
};
