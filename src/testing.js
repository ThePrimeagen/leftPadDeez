function fun(fn, count, ...args) {
    const start = performance.now();

    for (let i = 0; i < count; ++i) {
        fn(...args);
    }

    return performance.now() - start;
}

function round(x) {
    return Math.floor(x * 100) / 100;
}

function testLeftpad(fn, name, range = [10, 100, 1000, 10000]) {
    const result = [];
    range.forEach(x => {
        range.forEach(y => {
            result.push([name, round(fun(fn, x, "foo", y))]);
        });
    });
    return result;
}

function testSpeed({fn, name, repeats}, ...args) {
    repeats = repeats || [10, 100, 1000, 10000];
    if (typeof repeats === "number") {
        repeats = [repeats];
    }
    return repeats.map(x => {
        return [x, fun(fn, x, ...args)];
    });
}

module.exports = {
    fun,
    testLeftpad,
    testSpeed,
};



