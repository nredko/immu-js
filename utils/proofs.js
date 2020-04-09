const crypto = require("crypto");

const NodePrefix = 1;
const SHA256_SIZE = 32

const BigInt0 = BigInt("0")
const BigInt1 = BigInt("1")
const Bigint2 = BigInt("2")

function consistencyVerify(path, second, first, secondHash, firstHash) {
    first = BigInt(first)
    second = BigInt(second)
    let l = path.length
    if (first == second && firstHash.compare(secondHash) == 0 && l == 0) {
        return true
    }
    if (!(first < second) || l == 0) {
        return false
    }
    let pp = path.slice()
    if (isPowerOfTwo(first + BigInt1)) {
        pp.push(firstHash)
    }
    let fn = first
    let sn = second

    while ((fn % Bigint2) == BigInt1) {
        fn >>= BigInt1
        sn >>= BigInt1
    }
    let fr = pp[0]
    let sr = pp[0]

    for (let k = 1; k < pp.length; k++) {
        if (sn == BigInt0) {
            return false
        }
        if ((fn % Bigint2) == BigInt1 || fn == sn) {
            let tmp = Buffer.alloc(SHA256_SIZE * 2 + 1);
            tmp[0] = NodePrefix;
            pp[k].copy(tmp, 1);

            fr.copy(tmp, 1 + SHA256_SIZE)
            fr = Buffer.from(crypto.createHash('sha256').update(tmp).digest())

            sr.copy(tmp, 1 + SHA256_SIZE)
            sr = Buffer.from(crypto.createHash('sha256').update(tmp).digest())

            while ((fn % Bigint2) == BigInt0 && fn != BigInt0) {
                fn >>= BigInt1
                sn >>= BigInt1
            }
        } else {
            let tmp = Buffer.alloc(SHA256_SIZE * 2 + 1);
            tmp[0] = NodePrefix;
            sr.copy(tmp, 1)

            pp[k].copy(tmp, 1 + SHA256_SIZE)
            sr = Buffer.from(crypto.createHash('sha256').update(tmp).digest())
        }
        fn >>= BigInt1
        sn >>= BigInt1
    }

    return fr.compare(firstHash) == 0 && sr.compare(secondHash) == 0 && sn == BigInt0
}

function inclusionVerify(p, at, i, root, leaf) {
    at = BigInt(at);
    i = BigInt(i);

    if (i > at || (at > 0 && p.length == 0)) {
        return false;
    }

    let h = leaf;

    for (let k = 0; k < p.length; k++) {
        let t = Buffer.alloc(SHA256_SIZE * 2 + 1);
        t[0] = NodePrefix;

        if (i % 2n == 0 && i != at) {
            h.copy(t, 1);
            p[k].copy(t, 1 + SHA256_SIZE);
        } else {
            p[k].copy(t, 1);
            h.copy(t, 1 + SHA256_SIZE);
        }

        const hash = crypto.createHash('sha256');
        h = Buffer.from(hash.update(t).digest());

        i = i / 2n;
        at = at / 2n;
    }

    return at == i && h.compare(root) == 0;
}

const verify = function (proof, leaf, prevRoot) {
    if (proof == null || Buffer.compare(leaf, proof.leaf) != 0)
        return false;

    let path = fromSlice(proof.inclusionPath);

    let verifiedInclusion = inclusionVerify(
        path,
        proof.at,
        proof.index,
        Buffer.from(proof.root),
        Buffer.from(proof.leaf)
    );

    if (!verifiedInclusion) {
        return false;
    }

    // we cannot check consistency when the previous root is not provided
    if (prevRoot.index == 0 && prevRoot.root.length == 0) {
        return true;
    }

    path = fromSlice(proof.consistencyPath);

    return consistencyVerify(path, proof.at, prevRoot.index, Buffer.from(proof.root), Buffer.from(prevRoot.root));
}

const isPowerOfTwo = x => x != BigInt0 && (x & (x - BigInt1)) == BigInt0;

const fromSlice = slice => {
    return slice.map(s => Buffer.from(s));
}

module.exports = {
    verify,
    consistencyVerify,
    inclusionVerify
};