function flatten(s) {
    return Number(s);
}

function specialCaseFactory(padCache) {
    return function specialCase(str, len, ch) {
        len = len - str.length;
        if (len <= 0) return str;

        if (ch === " " || !ch) {
            ch = ch || " ";
            if (len < padCache.length) {
                return flatten(padCache.substring(0, len) + str);
            }
            let pad = padCache.substring(0);
            while (pad.length < len) pad += pad;
            return flatten(pad.substring(0, len) + str);
        }

        return exports.leftPadEmber(str, len, ch);
    }
}

const zepto = " ".repeat(2);
const atto = " ".repeat(4);
const femto = " ".repeat(8);
const pico = " ".repeat(16);
const nano = " ".repeat(32);
const micro = " ".repeat(64);
const miniPad = " ".repeat(128);
const smallPad = " ".repeat(512);
const mediumPad = " ".repeat(1024);
const largePad = " ".repeat(1024 * 5);
const hugePad = " ".repeat(1024 * 10);

exports.specialCase1 = specialCaseFactory(zepto);
exports.specialCase2 = specialCaseFactory(atto);
exports.specialCase3 = specialCaseFactory(femto);
exports.specialCase4 = specialCaseFactory(pico);
exports.specialCase5 = specialCaseFactory(nano);
exports.specialCase6 = specialCaseFactory(micro);
exports.specialCase7 = specialCaseFactory(miniPad);
exports.specialCase8 = specialCaseFactory(smallPad);
exports.specialCase9 = specialCaseFactory(mediumPad);
exports.specialCase10 = specialCaseFactory(largePad);
exports.specialCase11 = specialCaseFactory(hugePad);

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
    return flatten(ch + str);
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
    return flatten(p + s);
}

