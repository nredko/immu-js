const itemUtils = require("./../utils/item");
const Proofs = require("./../utils/proofs");

const call = (immuClient, rootService, request, callback) => {
	rootService.getRoot((root) => {
		let index = { index: root.index };
		let protoReq = {
			key: { key: Buffer.from(request.key) },
			rootIndex: index
		};

		immuClient._safeGet(protoReq, (err, msg) => {
			if (err) {
				callback(err, null);
				return;
			}

			let verified = Proofs.verify(msg.proof, itemUtils.hash(msg.item), root);

			if (verified) {
				let toCache = {
					index: msg.proof.at,
					root: msg.proof.root
				};

				rootService.setRoot(toCache);
			}

			let i = msg.item;
			let valueRaw = Buffer.from(i.value);

			callback(null, {
				index: i.index,
				key: i.key,
				value: valueRaw.subarray(8),
				timestamp: Number(valueRaw.slice(0, 8).readBigUInt64BE()),
				verified
			});
		});
	});
}

module.exports.call = call;