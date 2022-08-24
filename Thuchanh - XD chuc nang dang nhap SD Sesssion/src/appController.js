const fs = require('fs')
const qs = require('qs')
const localStorage = require('local-storage')


class AppController {

    doLogin(req,res) {
        fs.readFile('./views/login.html', 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(data);
            res.end();
        });
    }

    showHome(req, res) {
        let source = '';
        req.on('data' ,chunk => {
            source += chunk;
        })
        req.on('end', () => {
            let newData = qs.parse(source);
            let expires = Date.now() + 1000*60*60;
            let tokenSession = "{\"user\":\""+newData.user+"\",\"password\":\""+newData.password+"\",\"expires\":"+expires+"}";
            let tokenId = this.createRandomString(8)
            this.createTokenSession(tokenId ,tokenSession);
            localStorage.set('token',tokenId);
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


    createRandomString(strLeng) {
        let temp = strLeng;
        if (typeof strLeng === 'number' && strLeng > 0) {
            strLeng = temp;
        } else strLeng = false;
        if (strLeng) {
            let possibleCharacter = 'abcdefghiklmnopqwerszx1234567890';
            let str = '';
            for (let i = 0; i < strLeng; i++) {
                let randomCharacter = possibleCharacter.charAt(Math.floor(Math.random()*possibleCharacter.length));
                str += randomCharacter;
            }
            return str;
        }
    }

    createTokenSession(fileName, data) {
        fileName = './token/' + fileName;
        fs.writeFile(fileName, data, (err) => {
        });
    }

    readSession(req, res) {
        let tokenID = localStorage.get('token');
        if (tokenID) {
            let sessionStr = '';
            let expires = 0;
            fs.readFile('./token' + tokenID, 'utf-8' , (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                sessionStr = String(data);
                expires = JSON.parse(sessionStr).expires;
                let now = Date.now();
                if (expires < now) {
                    this.doLogin(req, res);
                } else {
                    fs.readFile('./views/dashboard.html', 'utf-8', (err, data) => {
                        if (err) {
                            console.log(err);
                        }
                        data = data.replace('{user}', data.user);
                        data = data.replace('{password}', data.password);
                        res.writeHead(200, { 'Content-type': 'text/html' });
                        res.write(data);
                        res.end();
                    })
                }
            })
        } else {
            this.doLogin(req, res);
        }
    }
}

module.exports = AppController;