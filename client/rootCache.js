const fs = require('fs');

class RootCache {
	constructor() {
		this.ROOT_FN = ".root";
	}
	get() {
		let rootBinary = fs.readFileSync(this.ROOT_FN);
		return JSON.parse(rootBinary);
	}
	set(root) {
		fs.writeFileSync(this.ROOT_FN, JSON.stringify(root));
	}
}

module.exports = RootCache;