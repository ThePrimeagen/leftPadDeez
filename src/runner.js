const {
    testSpeed,
} = require("./testing");

const leftPads = require("./leftPads");

for (const [name, leftPad] of Object.entries(leftPads)) {
    testSpeed(leftPad, name);
}

