const http = require("http");
const AppController = require("./src/appController");
const port = 8080;

let app = new AppController();

const server = http.createServer((req, res) => {
    let path = req.url;
    app.readSession(req, res);
    switch (path) {
        case '/':
            app.doLogin(req,res);
            break;
        case '/home':
            app.showHome(req, res);
            break;
        default:
            res.end();
    }

})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})