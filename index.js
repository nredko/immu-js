var crypto = require ("crypto");

module.exports.inclusionVerify = function (path, at, i, root, leaf) { 
  return _inclusionVerify(path, at, i, root, leaf);
};

module.exports.consistencyVerify = function (path, at, i, root, leaf) { 
  return _consistencyVerify(path, at, i, root, leaf);
};

module.exports.digest = function (index, key, value) { 
  return _digest(index, key, value);
};

module.exports.init = function (immudbUrl) { 
	return _init(immudbUrl);
};

module.exports.health = function () { 
	return _health();
};

module.exports.safeGet = function (key, rootIndex) { 
	return _safeGet(key, rootIndex);
};

module.exports.safeSet = function (key, value, rootIndex) { 
	return _safeSet(key, value, rootIndex);
};

const LeafPrefix = 0;
const NodePrefix = 1;

const SHA256_SIZE = 32

const BigInt0 = BigInt("0")
const BigInt1 = BigInt("1")
const Bigint2 = BigInt("2")


_consistencyVerify(path, second, first, secondHash, firstHash) {
	first = BigInt(first)
	second = BigInt(second)
	let l = path.length
	if (first == second && firstHash.compare(secondHash) == 0 && l == 0){
		return true
	}
	if (first < second || l == 0){
		return false
	}
	let pp = path.slice()
    if( _isPowerOfTwo(first + BigInt1)){
        pp.push(firstHash)
	}
	let fn = first
    let sn = second
    
    while ((fn%Bigint2) == BigInt1){
		fn >>= BigInt1
        sn >>= BigInt1
	}
	let fr = pp[0]
	let sr = pp[0]
	
	for (let k = 1; k < p.length; k++){
		if (sn == BigInt0){
			return false
		}
	    if ((fn%Bigint2) == BigInt1 || fn == sn){
			let tmp = Buffer.from([NodePrefix])
			tmp.copy( p[k] , 1)

			tmp.copy( fr , 1+SHA256_SIZE)
			fr = Buffer.from( crypto.createHash('sha256').update(tmp).digest())

			tmp.copy( sr , 1+SHA256_SIZE)
			sr = Buffer.from( crypto.createHash('sha256').update(tmp).digest())
			
			while ((fn%Bigint2) == BigInt0 && fn != BigInt0){
				fn >>= BigInt1
				sn >>= BigInt1
			}
		}else{
			let tmp = Buffer.from([NodePrefix])
			tmp.copy( sr , 1)

			tmp.copy( p[k] , 1+SHA256_SIZE)
			sr = Buffer.from( crypto.createHash('sha256').update(tmp).digest())
		}
		fn >>= BigInt1
		sn >>= BigInt1
	}

	return fr.compare(firstHash) == 0 && sr.compare(secondHash) == 0 && sn == BigInt0
}

function _isPowerOfTwo(x) {
    return (x!=BigInt0 && (x & (x-BigInt1)) == BigInt0)
}

function _inclusionVerify(p, at, i, root, leaf) {
	at = BigInt(at)
	i = BigInt(i)
	
	if (i > at || (at > 0 && p.length == 0)) {
		return false
	}

	let h = leaf

	for (let k = 0; k < p.length; k++){
		let t = Buffer.from([NodePrefix])
		
		if (i % BigInt("2") == 0 && i != at){
			t.copy(h, 1)
			t.copy(p[k], 1+SHA256_SIZE)
		}else{
			t.copy(p[k], 1)
			t.copy(h, 1+SHA256_SIZE)
		}
		const hash = crypto.createHash('sha256');    
		h = Buffer.from(hash.update(t).digest())
		i = i/BigInt("2")
		at = at/BigInt("2")
	}
	return at == i && h.compare(root) == 0

}

function _digest( index , key, value ) {
	index = index.toString()
    k = Buffer.from(key)
	v = Buffer.from(value)
    c = Buffer.alloc(1+8+8+k.length+v.length)
    c[0] = LeafPrefix 
	buf_index = Buffer.alloc(8)
	buf_index.writeBigUInt64BE(BigInt(index))
    buf_index.copy(c, 1)
	buf_key = Buffer.alloc(8)
	buf_key.writeBigUInt64BE(BigInt(k.length))
	buf_key.copy(c, 1+8)
	k.copy(c, 1+8+8)
	v.copy(c, 1+8+8+k.length)
	const hash = crypto.createHash('sha256');    
	d = hash.update(c).digest()
	return Buffer.from(d)
}

function _init(immudbUrl) {
	try {
		if (immudbUrl) {
			grpc = require('grpc');
			protoLoader = require('@grpc/proto-loader');
	
			const PROTO_PATH = require('path').resolve(__dirname + '/schema.proto');
	
			const packageDefinition = protoLoader.loadSync(
				PROTO_PATH,
				{keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true
			});
					
			const immudb_schema = grpc.loadPackageDefinition(packageDefinition).immudb.schema;
			this.client = new immudb_schema.ImmuService(immudbUrl, grpc.credentials.createInsecure());
		
			this.client.CurrentRoot({}, function(err, response) {
				if (response) {
					return {
						root: response.root,
						index: response.index
					};
				} else if (err) {
					console.error(err);
				} else {
					return null;
				}
			});
		}
	} catch (err) {
		console.error(err);
	}
}

function _health() {
	try {
		this.client.health({}, function(err, response) {
			if (response) {
				return {
					root: response.root,
					index: response.index
				};
			} else if (err) {
				console.error(err);
			} else {
				return null;
			}
		}); 
	} catch (err) {
		console.error(err);
	}
}

function _safeGet(key, rootIndex) {
	try {
		this.client.safeGet({key: key, rootIndex: rootIndex}, function(err, response) {
			if (response) {
				return {
					item: {
						key: response.item.key,
						value: response.item.value,
						index: response.item.index,
					},
					proof: {
						leaf: response.proof.leaf,
						index: response.proof.index,
						root: response.proof.root,
						at: response.proof.at,
						inclusionPath: response.proof.inclusionPath,
						consistencyPath: response.proof.consistencyPath
					}
				};
			} else if (err) {
				console.error(err);
			} else {
				return null;
			}
		});  
	} catch (err) {
		console.error(err);
	}
}

function _safeSet(key, value, index) {
	try {
		this.client.safeSet({key: key, value: value, rootIndex: rootIndex}, function(err, response) {
			if (response) {
				
				// TODO _inclusionVerify

				return {
					kv: {
						key: response.key,
						value: response.value
					},
					rootIndex: {
						index: response.index
					}
				};
			} else if (err) {
				console.error(err);
			} else {
				return null;
			}
		}); 
	} catch (err) {
		console.error(err);
	}
}