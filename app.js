const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes/app-routes');

app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(express.json()) //parse JSON body from client
app.use(express.urlencoded({extended: false})); //parse url-encoded body send from html forms
app.use(cookieParser())
app.use(session({                                //config session
    name: process.env.SESSION_NAME,
    secret: 'PynOjAuHetAuWawtinAytVunarAcjeBlybEshkEjVudyelwa',
    resave: false,
    saveUninitialized: false ,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true
    }
}));


app.use(express.static(path.join(__dirname, 'static/stylesheet')));
app.use(express.static(path.join(__dirname, 'static/javascript')));
app.use(express.static(path.join(__dirname, 'static/photos')));

app.use('/', routes);

module.exports = app;