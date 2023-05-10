const hugePad = " ".repeat(1024 * 10);
exports.specialCase = function specialCase(str, len, ch) {
    len = len - str.length;
    if (len <= 0) return str;

    ch = ch || " ";
    if (ch === " " || !ch && len < hugePad.length) {
        return hugePad.substring(0, len) + str;
    }

    return exports.leftPadEmber(str, len, ch);
}

exports.so = function stackOverflow(value, length) {
    return (value.toString().length < length) ? stackOverflow("0" + value, length - 1) : value;
}

exports.primeLive = function(str, len, ch) {
    return new Array(len - str.length).join(!ch && ch !== 0 ? " " : ch) + str;
}

exports.Boody = function BoodyleftPad(str, len, ch) {
    let pad = [];
    len = len - str.length;
    for (let i = 0; i < len; i++) {
        pad.push(ch);
    }

    str = pad.join("") + str;
    return str;
}

exports.sotr = function stackOverflowTR(value, length) {
    if (length <= value.length) {
        return value;
    }
    return "0" + stackOverflowTR(value, length - 1);
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

    ch = ch.repeat(len);
    return ch + str;
}

exports.native = function(str, len, ch) {
    return str.padStart(len, ch);
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

/** assumes buffer is a Uint8Array **/
exports.buffer = function(str, l, c, buffer) {
    l -= str.length;
    if (l <= 0) return str;
    c ||= " ".charCodeAt(0);

    if (typeof c === "string") {
        c = c.charCodeAt(0);
    }

    for (let i = 0; i < l; i++) {
        buffer[i] = c;
    }
    buffer.write(str, l);

    return buffer.subarray(0, l + str.length);
}
