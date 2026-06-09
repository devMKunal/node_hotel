const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const logRequest = (req, res, next) => {
    console.log(`[${new Date()}] Requested to : ${req.originalUrl}`)
    next();
}

app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local', { session: false });


app.get('/', (req, res) => {
    res.send('Hello there! Welcome to our hotel');
})

const personRoutes = require('./routes/person_routes');
app.use('/person', localAuthMiddleware, personRoutes)

const menuRoutes = require('./routes/menu_routes');
app.use('/menu', menuRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('listening on port 3000')
})