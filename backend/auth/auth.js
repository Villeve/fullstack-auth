const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

var client = jwksClient({
    jwksUri: 'http://keycloak:8080/auth/realms/keycloak-demo/protocol/openid-connect/certs'
    //jwksUri: 'http://localhost:8080/auth/realms/keycloak-demo/protocol/openid-connect/certs'
});
const getKey = (header, callback) => {
    client.getSigningKey(header.kid, function (error, key) {
        if (error) {
            callback(error, null)
            return;
        }
        else {
            var signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        }
    });
}

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401)
    }
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.sendStatus(401)
        }
        if (!decoded || Date.now() >= decoded.exp * 1000) {
            return res.sendStatus(401)
        }
        next();
    })
}

const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401);
    }
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
        return res.sendStatus(401);
    }
    if (!decodedToken.payload.realm_access.roles.includes("admin")) {
        return res.sendStatus(401);
    }
    next();
}

const getUserInfo = (token) => {
    if (!token) {
        throw "Token missing!"
    }
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
        throw "Token could not be decoded!"
    }
    return decodedToken
}

module.exports = { validateToken, isAdmin, getUserInfo }