const fs = require('fs');
const cookie = require('cookie');

class Controller {

    home(req, res , views) {
        let cookies = cookie.parse(req.headers.cookie || '');
        if (cookies.views) {
            views = Number(cookies.views) + 1;
        }
        res.setHeader('Set-cookie', cookie.serialize('views' , views , {httpOnly : true, maxAge: 60*60*24*7}));
        let data = fs.readFileSync('./views/homePage.html', 'utf-8')
        data = data.replace('{views}' , views);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    }
}

module.exports = Controller;