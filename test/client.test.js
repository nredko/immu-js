var assert = require('assert');
var immujs = require('../index.js');

describe('immudb', function() {
  describe('grpc client', function() {
    it('with a valid immudbUrl should return the client', function() {
      let path = 'localhost:8080';
      let v = immujs.client(path);
      assert.notEqual(v, null);
    });
  });
});

describe('immudb', function() {
  describe('grpc client', function() {
    it('with an empty immudbUrl should return null', function() {
      let path = '';
      let v = immujs.client(path);
      assert.equal(v, null);
    });
  });
});

