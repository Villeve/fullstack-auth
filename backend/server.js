const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { isAdmin, validateToken, getUserInfo } = require('./auth/auth.js')
const cors = require('cors');

const app = express()

app.use(cors());

var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore })

app.use(session({
    secret: 'veryLongSecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}))

app.use(keycloak.middleware());

app.use(bodyParser.json());

// Every request must include valid token
app.use(validateToken)

const port = 8000

app.get('/api/me', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    res.json(getUserInfo(token))
});

app.get('/api/message', isAdmin, (req, res) => {
    res.send("I can see you are an admin! Sadly there is no secret message :(")
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))