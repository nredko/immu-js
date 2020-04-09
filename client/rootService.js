const RootCache = require('./rootCache');

class RootService {
	constructor(immuClient) {
		this.immuClient = immuClient;
		this.cache = new RootCache();
	}
	init(onComplete) {
		this.immuClient.currentRoot({}, (err, response) => {
			if (err) {
				throw "Root not found";
			}

			this.cache.set(response);

			if (onComplete)
				onComplete(response);
		});
	}
	getRoot(onComplete) {
		try {
			let root = this.cache.get();
			onComplete(root);
		} catch (_) {
			this.immuClient.currentRoot({}, (err, response) => {
				if (err) {
					throw "Root not found";
				}

				this.cache.set(response);
				onComplete(response);
			});
		}
	}

	setRoot(value) {
		this.cache.set(value);
	}
};

module.exports = RootService;