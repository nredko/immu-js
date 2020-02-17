var assert = require('assert');
var immujs = require('../index.js');

describe('immudb', function() {
  describe('consistency', function() {
    it('verify with empty should return true', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "0", "0",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, true);
    });
  });
});

describe('immudb', function() {
  describe('digest', function() {
    it('verify 1 1 should return true', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "1", "1",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, true);
    });
  });
});

describe('immudb', function() {
  describe('diconsistencygest', function() {
    it('verify 0 0 not empty should return false', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "0", "0",  Buffer.from([1]),  Buffer.from([2]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function() {
  describe('consistency', function() {
    it('verify 0 1 empty should return false', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "0", "1",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function() {
  describe('consistency', function() {
    it('verify 1 0 empty should return false', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "1", "0",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function() {
  describe('consistency', function() {
    it('verify 2 1 empty should return false', function() {
      let path = []
      let v = immujs.consistencyVerify(path, "2", "1",  Buffer.from([]),  Buffer.from([]))
      assert.equal(v, false);
    });
  });
});



