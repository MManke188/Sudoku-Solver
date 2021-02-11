const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let puzzles = require('../controllers/puzzle-strings.js')
let testPuzzle = puzzles['puzzlesAndSolutions'][0][0]
let testSolution = puzzles['puzzlesAndSolutions'][0][1]
let invalidChars = '.........3...........................4...........7............4.......a..........'
let invalidLength = '..........................................................................123'
let unsolvable = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.6'
let example = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

suite('Functional Tests', () => {
  // #1
  test('Solve a puzzle with valid puzzle string',  (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: testPuzzle})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.solution, testSolution)
        done();
      })
  });
  // #2
  test('Solve a puzzle with missing puzzle string',  (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Required field missing' })
        done();
      })
  });
  // #3
  test('Solve a puzzle with invalid characters',  (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: invalidChars})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
        done();
      })
  });
  // #4
  test('Solve a puzzle with incorrect length',  (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: invalidLength})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
        done();
      })
  });
  // #5
  test('Solve a puzzle that cannot be solved',  (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: unsolvable})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
        done();
      })
  });
  // #6
  test('Check a puzzle placement with all fields',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1', value: 7})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.deepEqual(res.body, {valid: true})
        done();
      })
  });
  // #7
  test('Check a puzzle placement with single placement conflict',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1', value: 2})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isFalse(res.body.valid)
        assert.property(res.body, 'conflict')
        assert.equal(res.body.conflict.length, 1)
        done();
      })
  });
  // #8
  test('Check a puzzle placement with multiple placement conflicts',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1', value: 1})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isFalse(res.body.valid)
        assert.property(res.body, 'conflict')
        assert.equal(res.body.conflict.length, 2)
        done();
      })
  });
  // #9
  test('Check a puzzle placement with all placement conflicts',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1', value: 5})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isFalse(res.body.valid)
        assert.property(res.body, 'conflict')
        assert.equal(res.body.conflict.length, 3)
        done();
      })
  });
  // #10
  test('Check a puzzle placement with missing required fields',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Required field(s) missing' })
      })
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Required field(s) missing' })
      })
    chai.request(server)
      .post('/api/check')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Required field(s) missing' })
        done();
      })
  });
  // #11
  test('Check a puzzle placement with invalid characters',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: invalidChars, coordinate: 'A1', value: 8})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
        done();
      })
  });
  // #12
  test('Check a puzzle placement with incorrect length',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: invalidLength, coordinate: 'D3', value: 9})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
        done();
      })
  });
  // #13
  test('Check a puzzle placement with invalid placement coordinate',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'invalidCoord', value: 8})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Invalid coordinate'})
        done();
      })
  });
  // #14
  test('Check a puzzle placement with invalid placement value',  (done) => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1', value: 'invalid value'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Invalid value' })
      })

    chai.request(server)
      .post('/api/check')
      .send({puzzle: example, coordinate: 'A1', value: 10})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'Invalid value' })
        done();
      })
  });
  
});

