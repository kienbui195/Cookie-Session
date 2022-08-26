const http = require("http");
const url = require("url");
const Controller = require("./src/js/controller");
const port = 8000;

let views = 0;

let app = new Controller();

const server = http.createServer((req, res) => {
    let path = req.url;

    switch(path) {
        case '/':
            app.home(req, res, views);
            break;
        default:
            res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});