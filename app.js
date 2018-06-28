var express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const usersController = require('./controllers/usersController');
//const pug = require('pug');


//from brad traversy-> should be in a login.js file probably
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://matcha:matcha@ds159129.mlab.com:59129/matchaproject');
var db = mongoose.connection;
const path = require('path');


var routes = require('./routes/index');
var users = require('./routes/users');
//ends here


var app = express();
// const upload = require("./uploadFile");


//mongoose.connect('mongodb://matcha:matcha@ds159129.mlab.com:59129/matchaproject');
// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//some more brad
//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
    secret: 'matcha',
    saveUninitialized: true,
    resave: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//flash middleware
app.use(flash());

//global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

app.use('/', routes);
app.use('/users', users);
//ends

// app.use(express.static('./public'));

//usersController(app);

// app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, 'views/index.html'));
// });

// app.get("/profile", function (req, res) {
//     res.sendFile(path.join(__dirname, 'views/profile.html'));
// });

// app.get("/loggedin", function (req, res) {
//     res.sendFile(path.join(__dirname, "views/home.html"));
// });

app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});