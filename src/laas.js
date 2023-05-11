const http = require("http");
const zlib = require('zlib');

const laases = require("./leftpadFinalists");

const genericError = "please provide query params name=name&str=your_string&len=number&char=your_char";

class BufferPool {
    constructor(maxSize = 10_000) {
        this.buffers = [];
        this.maxSize = maxSize;
    }

    get() {
        if (this.buffers.length === 0) {
            return Buffer.allocUnsafe(this.maxSize);
        }
        return this.buffers.pop();
    }

    put(buffer) {
        this.buffers.push(buffer);
    }
}

const bufferPool = new BufferPool();
let sinceLastRequest = Date.now();

const setFlagsFromString = require('v8').setFlagsFromString;
const runInNewContext = require("vm").runInNewContext;

setFlagsFromString('--expose_gc');
const gc = runInNewContext('gc'); // nocommit

function runGC() {
    if (Date.now() - sinceLastRequest > 1000) {
        gc();
    }
    setTimeout(runGC, 1000);
}
runGC();

function grabValue(str, key, defaultValue) {
    const idx = str.indexOf(key);
    if (idx === -1) {
        return defaultValue;
    }

    let endIdx = str.indexOf("&", idx);
    if (endIdx === -1) {
        endIdx = str.length;
    }

    return str.substring(idx + key.length + 1, endIdx);
}

const server = http.createServer((req, res) => {
    sinceLastRequest = Date.now();
    const query = req.url.split("?")[1];
    if (!query) {
        res.
            writeHead(400, { "Content-Type": "text/html" }).
            end(`<h1>you suck.  ${genericError}</h1>`);
        return;
    }

    const name = grabValue(query, "name", "");
    const str = grabValue(query, "str", "");
    const len = +grabValue(query, "len", "");
    const char = grabValue(query, "char", "");

    if (!laases[name] || !str || !len) {
        res.
            writeHead(400, { "Content-Type": "text/html" }).
            end(`<h1>name, str, len missing.  ${genericError}</h1>`);
        return;
    }

    const acceptEncoding = req.headers['accept-encoding']
    const gzip = acceptEncoding && acceptEncoding.includes('gzip');

    const outBuffer = [];
    const buffersUsed = [];
    for (let i = 0; i < 100; ++i) {
        let out = undefined;
        if (name === "buffer") {
            const outerBuffer = bufferPool.get();
            out = laases[name](str, len, char, outerBuffer);
            outBuffer.push(out.toString());

            buffersUsed.push(outerBuffer);
        } else {
            out = laases[name](str, len, char);
            outBuffer.push(out);
        }
    }

    const out = outBuffer.join(",");
    if (gzip) {
        zlib.gzip(out.buffer || out, (err, buffer) => {
            if (err) {
                res.writeHead(500);
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Encoding': 'gzip',
                'Content-Type': 'text/plain'
            });
            res.end(buffer, function() {
                for (const outerBuffer of buffersUsed) {
                    bufferPool.put(outerBuffer);
                }
            });
        });
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(out, function() {
            for (const outerBuffer of buffersUsed) {
                bufferPool.put(outerBuffer);
            }
        });
    }
});

server.listen(42068, function() {
    console.log("listen enxt");
}); // disappoint

