const proofs = require("./utils/proofs");
const digest = require("./utils/digest");

module.exports.inclusionVerify = function (path, at, i, root, leaf) {
	return proofs.inclusionVerify(path, at, i, root, leaf)
};

module.exports.consistencyVerify = function (path, at, i, root, leaf) {
	return proofs.consistencyVerify(path, at, i, root, leaf)
};

module.exports.digest = function (index, key, value) {
	return digest(index, key, value);
};

module.exports.client = function (immudbUrl) {
	return _client(immudbUrl)
};


function _client(immudbUrl) {
	if (!immudbUrl)
		return null;

	const grpc = require("grpc");
	const protoLoader = require("@grpc/proto-loader");
	const path = require("path");

	const safeGet = require('./handler/safeGet');
	const safeSet = require('./handler/safeSet');
	const rootService = require('./client/rootService');

	const PROTO_PATH = path.resolve(__dirname + "/schema.proto");
	const packageDefinition = protoLoader.loadSync(
		PROTO_PATH,
		{
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		});

	const immudbSchema = grpc.loadPackageDefinition(packageDefinition).immudb.schema;
	const client = new immudbSchema.ImmuService(immudbUrl, grpc.credentials.createInsecure());
	const rs = new rootService(client);

	rs.init();

	client._safeGet = client.safeGet;
	client._safeSet = client.safeSet;

	client.safeGet = (request, callback) => safeGet.call(client, rs, request, callback);
	client.safeSet = (request, callback) => safeSet.call(client, rs, request, callback);

	return client;
}