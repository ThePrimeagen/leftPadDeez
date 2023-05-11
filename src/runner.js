const rightPad = require("right-pad");
const {
    testLeftpad,
} = require("./testing");

const leftPads = require("./leftpadFinalists");

const results = [];
for (const [name, leftPad] of Object.entries(leftPads)) {
    if (name === "buffer") {
        continue
    }
    results.push(testLeftpad(leftPad, name, [8000]));
}

const toPrint = results.flat();
const longest = toPrint.reduce((acc, [name]) => acc > name.length ? acc : name.length, 0);

for (const [name, time] of toPrint) {
    console.log(`${name.padEnd(longest)}: ${time}`);
}
