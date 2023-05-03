const folder = process.argv[2];
if (!folder) {
    throw new Error("please provide base folder");
}

function writeIntoBuffer(view, offset, values) {
    for (let i = 0; i < values.length; ++i) {
        view[offset + i] = values[i];
    }
}

function writeIntoBufferShortCircuit(view, offset, values, breakAt) {
    for (let i = 0; i < values.length; ++i) {
        if (i === breakAt) {
            break;
        }
        view[offset + i] = values[i];
    }
}

function writeIntoBufferShortCircuitWithReturn(view, offset, values, breakAt) {
    for (let i = 0; i < values.length; ++i) {
        if (i === breakAt) {
            return;
        }
        view[offset + i] = values[i];
    }
}

function writeIntoBufferReturn(view, offset, values) {
    for (let i = 0; i < values.length; ++i) {
        view[offset + i] = values[i];
        return;
    }
}


const {
    testSpeed,
} = require("./testing");

const small = new Uint8Array(100);
const medium = new Uint8Array(1024 * 10);
const large = new Uint8Array(1024 * 1024);

const smallValues = new Array(2).fill(0).map(_ => Math.floor(Math.random() * 256));
const mediumValues = new Array(4).fill(0).map(_ => Math.floor(Math.random() * 256));
const largeValues = new Array(6).fill(0).map(_ => Math.floor(Math.random() * 256));
const hugeValues = new Array(8).fill(0).map(_ => Math.floor(Math.random() * 256));

function write(view, fn) {
    return function small(values) {
        for (let i = 0; i < view.length; i += values.length) {
            fn(view, i, values);
        }
    }
}

function writeBreak(view, fn) {
    return function small(values, breakAt) {
        for (let i = 0; i < view.length; i += values.length) {
            fn(view, i, values, breakAt);
        }
    }
}

function runAndSave(config, values, name) {
    const out = [];
    for (let i = 0; i < 100; i++) {
        out.push(testSpeed(config, values));
    }
    fs.writeFileSync(name, out.map(x => x.join(",")).join("\n"));
}

function runAndSaveBreak(config, values, breakTo, name) {
    const out = [];
    for (let i = 0; i < 100; i++) {
        out.push(testSpeed(config, values, breakTo));
    }
    fs.writeFileSync(name, out.map(x => x.join(",")).join("\n"));
}

const fs = require("fs");
const path = require("path");

[
    [writeIntoBuffer, smallValues, "smallValues", 10],
    [writeIntoBuffer, smallValues, "smallValues", 100],
    [writeIntoBuffer, smallValues, "smallValues", 1000],
    [writeIntoBufferReturn, smallValues, "smallValues", 10],
    [writeIntoBufferReturn, smallValues, "smallValues", 100],
    [writeIntoBufferReturn, smallValues, "smallValues", 1000],
    [writeIntoBuffer, mediumValues, "mediumValues", 10],
    [writeIntoBuffer, mediumValues, "mediumValues", 100],
    [writeIntoBuffer, mediumValues, "mediumValues", 1000],
    [writeIntoBufferReturn, mediumValues, "mediumValues", 10],
    [writeIntoBufferReturn, mediumValues, "mediumValues", 100],
    [writeIntoBufferReturn, mediumValues, "mediumValues", 1000],
    [writeIntoBuffer, largeValues, "largeValues", 10],
    [writeIntoBuffer, largeValues, "largeValues", 100],
    [writeIntoBuffer, largeValues, "largeValues", 1000],
    [writeIntoBufferReturn, largeValues, "largeValues", 10],
    [writeIntoBufferReturn, largeValues, "largeValues", 100],
    [writeIntoBufferReturn, largeValues, "largeValues", 1000],
    [writeIntoBuffer, hugeValues, "hugeValues", 10],
    [writeIntoBuffer, hugeValues, "hugeValues", 100],
    [writeIntoBuffer, hugeValues, "hugeValues", 1000],
    [writeIntoBufferReturn, hugeValues, "hugeValues", 10],
    [writeIntoBufferReturn, hugeValues, "hugeValues", 100],
    [writeIntoBufferReturn, hugeValues, "hugeValues", 1000],
].forEach(([fn, values, valuesName, repeats]) => {
    runAndSave({fn: write(small, fn), repeats}, values, path.join(folder, `small_${fn.name}_${valuesName}_${repeats}.csv`));
    runAndSave({fn: write(medium, fn), repeats}, values, path.join(folder, `medium_${fn.name}_${valuesName}_${repeats}.csv`));
    runAndSave({fn: write(large, fn), repeats}, values, path.join(folder, `large_${fn.name}_${valuesName}_${repeats}.csv`));
});

[
    [writeIntoBufferShortCircuit, smallValues, "smallValues", 10],
    [writeIntoBufferShortCircuit, smallValues, "smallValues", 100],
    [writeIntoBufferShortCircuit, smallValues, "smallValues", 1000],
    [writeIntoBufferShortCircuitWithReturn, smallValues, "smallValues", 10],
    [writeIntoBufferShortCircuitWithReturn, smallValues, "smallValues", 100],
    [writeIntoBufferShortCircuitWithReturn, smallValues, "smallValues", 1000],
    [writeIntoBufferShortCircuit, mediumValues, "mediumValues", 10],
    [writeIntoBufferShortCircuit, mediumValues, "mediumValues", 100],
    [writeIntoBufferShortCircuit, mediumValues, "mediumValues", 1000],
    [writeIntoBufferShortCircuitWithReturn, mediumValues, "mediumValues", 10],
    [writeIntoBufferShortCircuitWithReturn, mediumValues, "mediumValues", 100],
    [writeIntoBufferShortCircuitWithReturn, mediumValues, "mediumValues", 1000],
    [writeIntoBufferShortCircuit, largeValues, "largeValues", 10],
    [writeIntoBufferShortCircuit, largeValues, "largeValues", 100],
    [writeIntoBufferShortCircuit, largeValues, "largeValues", 1000],
    [writeIntoBufferShortCircuitWithReturn, largeValues, "largeValues", 10],
    [writeIntoBufferShortCircuitWithReturn, largeValues, "largeValues", 100],
    [writeIntoBufferShortCircuitWithReturn, largeValues, "largeValues", 1000],
    [writeIntoBufferShortCircuit, hugeValues, "hugeValues", 10],
    [writeIntoBufferShortCircuit, hugeValues, "hugeValues", 100],
    [writeIntoBufferShortCircuit, hugeValues, "hugeValues", 1000],
    [writeIntoBufferShortCircuitWithReturn, hugeValues, "hugeValues", 10],
    [writeIntoBufferShortCircuitWithReturn, hugeValues, "hugeValues", 100],
    [writeIntoBufferShortCircuitWithReturn, hugeValues, "hugeValues", 1000],
].forEach(([fn, values, valuesName, repeats]) => {
    runAndSaveBreak({fn: writeBreak(small, fn), repeats}, values, Math.floor(values.length / 2), path.join(folder, `small_${fn.name}_${valuesName}_${repeats}.csv`));
    runAndSaveBreak({fn: writeBreak(medium, fn), repeats}, values, Math.floor(values.length / 2), path.join(folder, `medium_${fn.name}_${valuesName}_${repeats}.csv`));
    runAndSaveBreak({fn: writeBreak(large, fn), repeats}, values, Math.floor(values.length / 2), path.join(folder, `large_${fn.name}_${valuesName}_${repeats}.csv`));
});
