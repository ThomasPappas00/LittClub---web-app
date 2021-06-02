const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const path = require('path')

const routes = require('./routes/app-routes');
app.use('/', routes);

app.use(express.static(path.join(__dirname, 'static/stylesheet')));
app.use(express.static(path.join(__dirname, 'static/javascript')));
app.use(express.static(path.join(__dirname, 'static/photos')));

module.exports = app;