const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const route = require('./routes/router');
const cookieParser = require('cookie-parser')
const http = require('http');
const cors = require('cors');
const initSocket = require('./services/socket');
require('./config/databaseConfig')

dotenv.config()

const app = express()
const server = http.createServer(app)

const io = initSocket(server);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,PUT,POST,DELETE',
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../frontend/dist')))

const globalPrefix = '/api'

app.use(globalPrefix, (req, res, next) => {
    req.io = io;
    next();
}, route);

const port = 8080
server.listen(port, () => {
    console.log(`Running on port ${port}`)
})