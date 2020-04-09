const digest = require("./digest");

const hash = (item) => {
    if (item == null) {
        return null;
    }

    return digest(
        item.index,
        item.key,
        item.value
    );
}

module.exports.hash = hash;