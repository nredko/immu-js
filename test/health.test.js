var assert = require('assert');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var PROTO_PATH = __dirname + '/../schema.proto';

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
    
var immudb_schema = grpc.loadPackageDefinition(packageDefinition).immudb.schema;

describe('immudb', function() {
  describe('health', function() {
    it('should return true if immudb is running', function() {
        var client = new immudb_schema.ImmuService('127.0.0.1:8080',
        grpc.credentials.createInsecure());
        client.health({},function(err, response) {
            assert.equal(response.status, true);
        });
    });
  });
});