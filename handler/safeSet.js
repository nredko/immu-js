const itemUtils = require("./../utils/item");
const Proofs = require("./../utils/proofs");

const call = (immuClient, rootService, request, callback) => {
	rootService.getRoot((root) => {
		let index = { index: root.index };
		var valueB = Buffer.alloc(8 + request.kv.value.length);

		var buffTimestamp = Buffer.alloc(8);
		buffTimestamp.writeBigUInt64BE(BigInt(Date.now()));
		buffTimestamp.copy(valueB, 0);

		var buffValue = Buffer.from(request.kv.value);
		buffValue.copy(valueB, 8);

		let protoReq = {
			kv: {
				key: Buffer.from(request.kv.key),
				value: valueB
			},
			rootIndex: index
		};

		immuClient._safeSet(protoReq, (err, msg) => {
			if (err) {
				callback(err, null);
				return;
			}

			let item = {
				index: msg.index,
				key: protoReq.kv.key,
				value: protoReq.kv.value
			};

			if (Buffer.compare(itemUtils.hash(item), msg.leaf) != 0)
				throw "Proof does not match the given item";

			let verified = Proofs.verify(msg, msg.leaf, root);

			if (verified) {
				let toCache = { index: msg.index, root: msg.root };
				rootService.setRoot(toCache);
			}

			callback(null, {
				index: msg.index,
				leaf: msg.leaf,
				root: msg.root,
				at: msg.at,
				inclusionPath: msg.inclusionPath,
				consistencyPath: msg.consistencyPath,
				verified
			});
		});
	});
}

module.exports.call = call;