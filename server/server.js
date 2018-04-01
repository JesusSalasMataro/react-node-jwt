const TOKEN_SECRET = 'adlskjfdsoiweuorwelkjklsdfsd';

const http = require('http');
const crypto = require("crypto-js");
const repository = require("./repository.js");

const server = http.createServer(function(request, response) {
    if (request.method === 'GET') {
        _httpGet(request, response);
    }
}).listen(8080);


function _httpGet(request, response) {
    let token = _getToken(request);

    if (token === '') {
        const userId = _getUserId(request);

        if (userId !== '') {
            token = _generateToken(userId);
        }
    }
    else {
        token = _validateToken(token);
    }

    response.setHeader('Access-Control-Allow-Origin', request.headers.origin);    
    response.setHeader('Access-Control-Expose-Headers', 'X-Token');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('X-Token', token);
    response.writeHead(200);
    response.end('OK');    
}

function _getToken(request) {
    let token = '';
    const cookies = request.headers.cookie;

    cookies && cookies.split(';').forEach(function(cookie) {
        const itemsCookie = cookie.split('=');
        
        if (itemsCookie[0] === 'jwt') {
            token = itemsCookie[1];
        }
    });

    return token;
}

function _generateToken(userId) {
    const header = JSON.stringify(
    {
        "alg": "HS256",
        "typ": "JWT"
    });

    const payload = JSON.stringify(
    {
        "sub": userId
    });

    const headerBase64 = Buffer.from(header).toString('base64').replace(/=/g, '');
    const payloadBase64 = Buffer.from(payload).toString('base64').replace(/=/g, '');
    const signature = crypto.HmacSHA256(headerBase64 + '.' + payloadBase64, TOKEN_SECRET);
    return headerBase64 + '.' + payloadBase64 + '.' + signature;
}

function _validateToken(token) {
    const itemsToken = token.split('.');
    const header = itemsToken[0];
    const payload = itemsToken[1];
    const signature = itemsToken[2];

    const expectedSignature = crypto.HmacSHA256(header + '.' + payload, TOKEN_SECRET).toString();

    if (signature === expectedSignature) {
        return token;
    }
    else {
        return '';
    }
}

function _getUserId(request) {
    let username = '';
    let password = '';
    let userId = '';

    const params = request.url
        .split('?')[1]
        .split('&');

    params.forEach((param) => {
        let paramItems = param.split('=');

        if (paramItems[0] === 'username') {
            username = paramItems[1];
        }
        else if (paramItems[0] === 'password') {
            password = paramItems[1];
        }
    });

    if (username !== '' && password !== '') {
        userId = repository.getUserIdFromDB(username, password);
    }

    return userId;
}
