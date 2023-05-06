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

const server = http.createServer((req, res) => {
    const query = req.url.split("?")[1];
    if (!query) {
        res.
            writeHead(400, { "Content-Type": "text/html" }).
            end(`<h1>you suck.  ${genericError}</h1>`);
        return;
    }

    const queries = query.split("&");
    const parts = queries.reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value;
        return acc;
    }, {});

    const { name, str, len, char } = parts;
    if (!laases[name] || !str || !len) {
        res.
            writeHead(400, { "Content-Type": "text/html" }).
            end(`<h1>name, str, len missing.  ${genericError}</h1>`);
        return;
    }

    const acceptEncoding = req.headers['accept-encoding']
    const gzip = acceptEncoding && acceptEncoding.includes('gzip');

    let out = undefined;
    let outerBuffer = undefined;

    if (name === "buffer") {
        outerBuffer = bufferPool.get();
        out = laases[name](str, len, char, outerBuffer);
    } else {
        out = laases[name](str, len, char);
    }

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
                if (outerBuffer) {
                    bufferPool.put(outerBuffer);
                }
            });
        });
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(out, function() {
            if (outerBuffer) {
                bufferPool.put(outerBuffer);
            }
        });
    }
});

server.listen(42068, function() {
    console.log("listen");
}); // disappoint

