const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hello there! Welcome to our hotel');
})

const personRoutes = require('./routes/person_routes');
app.use('/person', personRoutes)

const menuRoutes = require('./routes/menu_routes');
app.use('/menu', menuRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('listening on port 3000')
})