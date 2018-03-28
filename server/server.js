const TOKEN_SECRET = 'adlskjfdsoiweuorwelkjklsdfsd';

const http = require('http');
const crypto = require("crypto-js");

const server = http.createServer(function(request, response) {
    const cookies = request.headers['cookie'];

    if (request.method === 'GET') {
        _httpGet(request, response);
    }
    else if (request.method === 'POST') {
        _httpPost(request, response);
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

function _httpPost(request, response) {        
    let body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        // process request body
    });
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
    const header =  {
        "alg": "HS256",
        "typ": "JWT"
    };

    const payload = {
        "sub": userId
    };

    const headerString = JSON.stringify(header);
    const payloadString = JSON.stringify(payload);
    const headerBase64 = Buffer.from(headerString).toString('base64').replace(/=/g, '');
    const payloadBase64 = Buffer.from(payloadString).toString('base64').replace(/=/g, '');
    const signature = crypto.HmacSHA256(headerBase64 + '.' + payloadBase64, TOKEN_SECRET);

    return headerBase64 + '.' + payloadBase64 + '.' + signature;
}

function _validateToken(token) {
    // TODO: validate token
    return token;
}

function _getUserId(request) {
    let username = '';
    let password = '';
    let userId = '';

    const paramsString = request.url.split('?')[1];
    const params = paramsString.split('&');

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
        userId = _getUserIdFromDB(username, password);
    }

    return userId;
}

function _getUserIdFromDB(username, password) {
    if (username === 'Jesus' && password === '12345') {
        return 'usr100458';
    }
    else {
        return '';
    }
}