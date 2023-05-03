exports.primeOriginalLeftPad = function(str, len, ch) {
    return new Array(len - str.length).join(!ch && ch !== 0 ? " " : ch) + str;
}

exports.leftPad = function(str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = " ";
    len = len - str.length;
    while (++i < len) {
        str = ch + str;
    }
    return str;
}

exports.leftPadEmber = function(str, len, ch) {
    str = String(str);
    ch = ch || " "; // i use double quotes because me > you ember..
    len = len - str.length;

    if (len <= 0) return str;

    ch = ch.repeat(Math.ceil(len / ch.length));
    return ch.slice(0, len) + str;
}
