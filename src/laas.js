const http = require("http");

const laases = require("./leftpadFinalists");

const genericError = "please provide query params name=name&str=your_string&len=number&char=your_char";
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

    res.end(laases[name](str, len, char));
});

server.listen(42068, function() {
    console.log("listen");
}); // disappoint

