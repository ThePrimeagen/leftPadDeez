const http = require("http");

const laases = require("./leftpadFinalists");

const genericError = "please provide query params name=name&str=your_string&len=number&char=your_char";
const bufferPool = new BufferPool();

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

const server = http.createServer((req, res) => {
    const query = req.url.split("?")[1];
    if (!query) {
        res.
            writeHead(400, { "Content-Type": "text/html" }).
            end(`<h1>you suck.  ${genericError}</h1>`);
        return;
    }

    const parts = query.split("&").reduce<((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value;
        return acc;
    }, {});

    const { name, str, len, char } = parts;
    if (!laases[name] || !str || !len) {
        res.
            writeHead(400, { "Content-Type": "text/html" }).
            end(`<h1>you suck.  ${genericError}</h1>`);
        return;
    }

    if (name === "buffer") {
        const buffer = bufferPool.get();
        res.end(laases[name](str, len, char, buffer), function() {
            bufferPool.put(buffer);
        });
    } else {
        res.end(laases[name](str, len, char))
    }
});

server.listen(42068, function() {
    console.log("listen");
}); // disappoint

