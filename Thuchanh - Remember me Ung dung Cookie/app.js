const cookie = require("cookie");
const escapeHtml = require("escape-html");
const http = require("http");
const url = require("url");
const port = 8080;
const qs = require("qs")

const server = http.createServer((req, res) => {
    const query = qs.parse(url.parse(req.url).query)
    if (query && query.remember && query.name) {
        res.setHeader('Set-cookie', cookie.serialize('name', String(query.name), { httpOnly: true, maxAge: 60*60*24*7}))
        res.statusCode = 302;
        res.setHeader('Location', req.headers.referer || '/');
        res.end();
        return;
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const name = cookies.name;
    res.setHeader('Content-type','text/html ; charset=utf-8');

    if (name) {
        res.write('<form method="GET">');
        res.write('<p>Welcome back, <b>' + escapeHtml(name) + '</b>!</p>');
        res.write('<input placeholder="enter your name" name="name" value="' + escapeHtml(name) + '"></br>');
        res.write('<input type="checkbox" id="remember" name="remember" value="true">\n' +
            '<label for="vehicle2"> Remember me</label><br>');
        res.write('<input type="submit" value="Set Name">');
        res.end()
    } else {
    res.write('<form method="GET">');
    res.write('<p>Hello, new visitor!</p>');
    res.write('<input placeholder="enter your name" name="name" value=""></br>');
    res.write('<input type="checkbox" id="remember" name="remember" value="true">\n' +
        '<label for="vehicle2"> Remember me</label><br>');
    res.write('<input type="submit" value="Set Name">');
    res.end('</form>');
}
})

server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})
