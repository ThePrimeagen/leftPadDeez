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

exports.leftPadCompareZero = function(str, len, ch) {
    str = String(str);
    if (!ch && ch !== 0) ch = " ";
    len = len - str.length;
    while (len-- >= 0) {
        str = ch + str;
    }
    return str;
}

exports.leftPadEmber = function(str, len, ch) {
    str = String(str);
    ch = ch || " "; // i use double quotes because me > you ember..
    len = len - str.length;

    if (len <= 0) return str;

    ch = ch.repeat(len);
    return ch + str;
}

exports.leftpadTravvy = function(s, l, c) {
    let p = "";
    s += p;
    l -= s.length;
    if (l <= 0) return s;
    c ||= " ";
    while (true) {
        p = l & 1 ? p + c : p;
        l >>= 1;
        if (!l) break;
        c += c;
    }
    return p + s;
}

exports.ember2 = function(s, l, c) {
    let p = "";
    l = l - s.length;
    if (l <= 0) return s;
    c = c || " ";
    if (l < 1000) {
        while (true) {
            p = l & 1 ? p + c : p;
            l = l >> 1;
            if (!l) break;
            c += c;
        }
    } else {
        c = c.repeat(l);
    }
    return p + s;
}

exports.nativePadStart = function(str, len, ch) {
    return str.padStart(len, ch);
}

exports.buffer = function(str, len, ch) {
    str = String(str);
    ch = ch || " ";

    const strBuffer = Buffer.from(str);
    const bonusLength = strBuffer.byteLength - str.length;
    const buffer = Buffer.alloc(Math.max(len, str.length) + bonusLength).fill(ch);

    strBuffer.copy(buffer, buffer.byteLength - strBuffer.byteLength);
    return buffer.toString();
}

// assuming its always white space of a certain max length
const whitespace = " ".charCodeAt(0);
const whitespaceBuffer = Buffer.alloc(10000).fill(whitespace);
exports.bufferSpecialCase = function(str, len) {
    str = String(str);

    const strBuffer = Buffer.from(str);
    const bonusLength = strBuffer.byteLength - str.length;
    const buffer = Buffer.from(whitespaceBuffer.slice(0, Math.max(len, str.length) + bonusLength));

    strBuffer.copy(buffer, buffer.byteLength - strBuffer.byteLength);
    return buffer.toString();
}

const whitespaceString = " ".repeat(10000);
exports.stringSpecialCase = function(str, len) {
    str = String(str);

    return whitespaceString.slice(0, Math.max(len, str.length) - str.length) + str;
}
