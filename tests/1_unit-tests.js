const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let puzzles = require('../controllers/puzzle-strings.js')
let testPuzzle = puzzles['puzzlesAndSolutions'][0][0]
let testSolution = puzzles['puzzlesAndSolutions'][0][1]
let invalidChars = '.........3...........................4...........7............4.......a..........'
let invalidLength = '..........................................................................123'
let example = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

suite('UnitTests', () => {
  // #1
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(testPuzzle))
    assert.equal(solver.solve(testPuzzle), testSolution)
    assert.equal(testPuzzle.length, 81)
    assert.isString(solver.solve(testPuzzle))
  })
  // #2
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.deepEqual(solver.validate(invalidChars), { error: 'Invalid characters in puzzle' })
  })
  // #3
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(invalidLength), { error: 'Expected puzzle to be 81 characters long' })
  })
  // #4
  test('Logic handles a valid row placement', () => {
    let result = solver.checkRowPlacement(example, 'A', '1', 7)
    assert.isTrue(result)
  })
  // #5
  test('Logic handles an invalid row placement', () => {
    let result = solver.checkRowPlacement(example, 'A', '1', 1)
    assert.isFalse(result)
  })
  // #6
  test('Logic handles a valid column placement', () => {
    let result = solver.checkColPlacement(example, 'A', '1', 7)
    assert.isTrue(result)
  })
  // #7
  test('Logic handles an invalid column placement', () => {
    let result = solver.checkColPlacement(example, 'A', '1', 1)
    assert.isFalse(result)
  })
  // #8
  test('Logic handles a valid region (3x3 grid) placement', () => {
    let result = solver.checkRegionPlacement(example, 'A', '1', 7)
    assert.isTrue(result)
  })
  // #9
  test('Logic handles an invalid region (3x3 grid) placement', () => {
    let result = solver.checkRegionPlacement(example, 'A', '1', 2)
    assert.isFalse(result)
  })
  // #10
  test('Valid puzzle strings pass the solver', () => {
    assert.isString(solver.solve(example))
    assert.equal(solver.solve(testPuzzle), testSolution)
  })
  // #11
  test('Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.solve(invalidLength))
    assert.isFalse(solver.solve(invalidChars))
    assert.isNotTrue(solver.validate(invalidLength))
    assert.isNotTrue(solver.validate(invalidChars))
  })
  // #12
  test('Solver returns the the expected solution for an incomplete puzzzle', () => {
    for(let i = 0; i < puzzles.length; i++) {
      assert.equal(solver.solve(puzzles[i][0]), puzzles[i][1])
    }
  })
  
});