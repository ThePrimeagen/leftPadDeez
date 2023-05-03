function fun(fn, count, ...args) {
    const start = performance.now();

    for (let i = 0; i < count; ++i) {
        fn(...args);
    }

    return performance.now() - start;
}

function testSpeed(fn, name) {
    [10, 100, 1000, 10000].forEach(x => {
        [10, 100, 1000, 10000].forEach(y => {
            console.log(name, x, y, fun(fn, x, "foo", y));
        });
    });
}

module.exports = {
    fun,
    testSpeed
};



