var assert = require('assert');
var { inclusionVerify } = require('./../utils/proofs');

describe('immudb', function () {
  describe('inclusion', function () {
    it('with an empty path should return true', function () {
      let path = []
      let v = inclusionVerify(path, "0", "0", Buffer.from([]), Buffer.from([]))
      assert.equal(v, true);
    });
  });
});

describe('immudb', function () {
  describe('inclusion', function () {
    it('with an empty path should return true', function () {
      let path = []
      let v = inclusionVerify(path, "1", "0", Buffer.from([]), Buffer.from([]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function () {
  describe('inclusion', function () {
    it('with an empty path should return true', function () {
      let path = []
      let v = inclusionVerify(path, "0", "1", Buffer.from([]), Buffer.from([]))
      assert.equal(v, false);
    });
  });
});

describe('immudb', function () {
  describe('inclusion', function () {
    it('with an empty path should return true', function () {
      let path = []
      let v = inclusionVerify(path, "1", "1", Buffer.from([]), Buffer.from([]))
      assert.equal(v, false);
    });
  });
});
