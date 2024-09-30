const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { route } = require('./routes/router');
require('./database/connect')

dotenv.config()

const app = express()

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('/api', (req, res) => {
    return res.send('Hello world')
});

const port = 8080
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})