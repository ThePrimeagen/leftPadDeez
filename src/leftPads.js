exports.primeOriginalLeftPad = function(str, len, ch) {
    return new Array(len - str.length).join(!ch && ch !== 0 ? " " : ch) + str;
}


exports.ember2 = function(s, l, c) {
    let p = "";
    l = l - s.length;
    if (l <= 0) return s;
    c = c || " ";
    while (true) {
        p = l & 1 ? p + c : p;
        l = l >> 1;
        if (!l) break;
        c += c;
    }
    return p + s;
}

exports.nativePadStart = function(str, len, ch) {
    return str.padStart(len, ch);
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

const asciiBuffer = Buffer.alloc(1024 * 500);
exports.bufferAsciiSpecialCase = function(str, len, ch) {
    str = String(str);
    ch = ch || " ";
    if (str.length > len) return str;
    const fillLen = len - str.length;

    asciiBuffer.fill(ch.charCodeAt(0), 0, fillLen);
    asciiBuffer.write(str, len - str.length);
    return asciiBuffer.toString("utf-8", 0, len);
}

exports.eloy = function(str, len, char) {
    const pad = (char || " ").charCodeAt(0);
    const buf = new Uint8Array(Math.max(str.length, len));

    for (let i = 0; i < str.length; ++i) {
        buf[buf.length - str.length + i] = str.charCodeAt(i);
    }
    for (let i = 0; i < buf.length - str.length; ++i) {
        buf[i] = pad;
    }

    return String.fromCharCode(null, buf);
}

const asciiArray = new Uint8Array(1024 * 500);
exports.eloy2 = function(str, len, char) {
    const pad = (char || " ").charCodeAt(0);

    const total = Math.max(str.length, len);
    for (let i = 0; i < str.length; ++i) {
        asciiArray[asciiArray.length - str.length + i] = str.charCodeAt(i);
    }

    for (let i = 0; i < total - str.length; ++i) {
        asciiArray[i] = pad;
    }

    return asciiArray.subarray(0, total).toString();
}

exports.ember2Buffr = function(s, l, c) {
    let offset = 0;
    c = c || " ";

    l = l - s.length;
    if (l <= 0) return s;
    while (true) {
        // assumptions c is a single char
        if (l & 1) {
            asciiBuffer.write(c, offset);
        }
        l = l >> 1;
        if (!l) break;
        offset += c.length;
        c += c;
    }
    asciiBuffer.write(s, offset);
    return asciiBuffer.toString("utf-8", 0, offset + s.length);
}

const asciiArrayBuffer = new ArrayBuffer(1024 * 500);
const asciiArray8 = new Uint8Array(asciiArrayBuffer);
const asciiArray32 = new Uint32Array(asciiArrayBuffer);

function padGen(l, c) {
    let offset = 0;
    c = c || " ";

    const code = c.charCodeAt(0);
    const fourCode = code | (code << 8) | (code << 16) | (code << 24);

    if (l <= 0) return s;

    const one = l & 1;
    l = l >> 1;
    const two = l & 1;
    l = l >> 1;

    let size = 0b100;

    while (true) {
        // assumptions c is a single char
        if (l & 1) {
            for (let i = 0; i < size; i += 4) {
                asciiArray32[offset++] = fourCode;
            }
        }
        l = l >> 1;
        size = size << 1;

        if (!l) break;
    }

    let offsetTotal = offset * 4;
    if (two) {
        asciiArray8[offsetTotal++] = code;
        asciiArray8[offsetTotal++] = code;
    }
    if (one) {
        asciiArray8[offsetTotal++] = code;
    }
    return asciiArray8.subarray(0, offsetTotal).toString();
}

exports.ember2Buffr2 = function(s, l, c) {
    return padGen(Math.max(l - s.length, 0), c) + s;
}

exports.bufferAscii = function(str, len, ch) {
    str = String(str);
    ch = ch || " ";

    const buffer = Buffer.alloc(Math.max(len, str.length), ch);
    buffer.write(str, buffer.byteLength - str.length);
    return buffer.toString();
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

const whitespaceString = " ".repeat(10000);
exports.stringSpecialCase = function(str, len, ch) {
    ch = ch || " ";
    str = String(str);

    if (len <= str.length) return str;

    if (ch === " ") {
        return whitespaceString.slice(0, len - str.length) + str;
    }
    return exports.leftpadTravvy(str, len, ch);
}
