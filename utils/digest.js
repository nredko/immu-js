crypto = require("crypto");

const LeafPrefix = 0;

var digest = function (index, key, value) {
    index = index.toString()
    k = Buffer.from(key)
    v = Buffer.from(value)
    c = Buffer.alloc(1 + 8 + 8 + k.length + v.length)
    c[0] = LeafPrefix
    buf_index = Buffer.alloc(8)
    buf_index.writeBigUInt64BE(BigInt(index))
    buf_index.copy(c, 1)
    buf_key = Buffer.alloc(8)
    buf_key.writeBigUInt64BE(BigInt(k.length))
    buf_key.copy(c, 1 + 8)
    k.copy(c, 1 + 8 + 8)
    v.copy(c, 1 + 8 + 8 + k.length)
    const hash = crypto.createHash('sha256');
    d = hash.update(c).digest()
    return Buffer.from(d)
}

module.exports = digest;