const hugePad = " ".repeat(1024 * 10);
exports.specialCase = function specialCase(str, len, ch) {
    len = len - str.length;
    if (len <= 0) return str;

    if (ch === " " || !ch) {
        ch = ch || " ";
        if (len < hugePad.length) {
            return flatten(hugePad.substring(0, len) + str);
        }
        let pad = hugePad.substring(0);
        while (pad.length < len) pad += pad;
        return pad.substring(0, len) + str;
    }

    return exports.leftPadEmber(str, len, ch);
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
    let p = "";
    s += p;
    l -= s.length;
    if (l <= 0) return s;
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
