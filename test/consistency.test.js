var assert = require('assert');
var immujs = require('../index.js');

describe('immudb', function() {
  describe('digest', function() {
    it('consistency verify with empty', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "0", "0",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, true);
    });
  });
});

describe('immudb', function() {
  describe('digest', function() {
    it('consistency verify 1 1', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "1", "1",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, true);
    });
  });
});

describe('immudb', function() {
  describe('digest', function() {
    it('consistency verify 0 0 not empty', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "0", "0",  Buffer.from([1]),  Buffer.from([2]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function() {
  describe('digest', function() {
    it('consistency verify 0 1 empty', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "0", "1",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function() {
  describe('digest', function() {
    it('consistency verify 1 0 empty', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "1", "0",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function() {
  describe('digest', function() {
    it('consistency verify 2 1 empty', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "2", "1",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, false);
    });
  });
});



