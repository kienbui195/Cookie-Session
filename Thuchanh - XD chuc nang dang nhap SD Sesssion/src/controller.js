const fs = require("fs");
const qs = require('qs');

class Controller  {

    doLoginPage(req,res) {
        fs.readFile('./views/login.html', 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(data);
            res.end();
        });
    }

    showHomePage(req, res) {
        let data = '';
        req.on('data' ,chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let newData = qs.parse(data);
            let expires = Date.now() + 1000*60*60;
            let tokenSession = "{\"user\":\""+newData.user+"\",\"password\":\""+newData.password+"\",\"expires\":"+expires+"}";
            this.createTokenSession(tokenSession);
            fs.readFile('./views/homePage.html','utf-8' , (err, datahtml) => {
                if (err) {
                    console.log(err)
                }
                datahtml = datahtml.replace('{user}', newData.user);
                datahtml = datahtml.replace('{password}', newData.password);
                res.writeHead(200, {'Content-type' : 'text/html'});
                res.write(datahtml);
                res.end();
                })
            })
        }


    createRandomString(strLength) {
        let temp = strLength;
        if (typeof strLength === 'number' && strLength > 0) {
            strLength = temp;
        } else strLength = false;
        if (strLength) {
            let possibleCharacter = 'abcdefghiklmnopqwerszx1234567890';
            let str = '';
            for (let i = 0; i < strLength; i++) {
                let randomCharacter = possibleCharacter.charAt(Math.floor(Math.random()*possibleCharacter.length));
                str += randomCharacter;
            }
            return str;
        }
    }

    createTokenSession(data) {
        let tokenId = this.createRandomString(2);
        let fileName = './token/' + tokenId;
        fs.writeFile(fileName, data, (err) => {
        });
    }
}

module.exports = Controller;