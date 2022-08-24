const http = require("http");
const url = require("url");
const qs = require("qs");
const fs = require("fs");
const Controller = require("./src/controller");
const port = 8080;

let app = new Controller();

const server = http.createServer((req, res) => {
    let path = req.url;
    switch (path) {
        case "/":
            app.doLoginPage(req,res);
            break;
        case '/home':
            app.showHomePage(req, res);
            break;
        default:
            res.end();
    }

})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})