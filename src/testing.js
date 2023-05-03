function fun(fn, count, ...args) {
    const start = performance.now();

    for (let i = 0; i < count; ++i) {
        fn(...args);
    }

    return performance.now() - start;
}

function testLeftpad(fn, name) {
    [10, 100, 1000, 10000].forEach(x => {
        [10, 100, 1000, 10000].forEach(y => {
            console.log(name, x, y, fun(fn, x, "foo", y));
        });
    });
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



