const {
    testLeftpad,
} = require("./testing");

const leftPads = require("./leftpadFinalists.js");

for (const [name, leftPad] of Object.entries(leftPads)) {
    testLeftpad(leftPad, name, [100, 1000, 10000]);
}

