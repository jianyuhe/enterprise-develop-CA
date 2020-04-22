/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , controll = require('./routes/controll')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');

var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : '13110772322',
              database : 'mydb'
            });
 
connection.connect();
 
global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// development only
 
app.get('/', routes.index);//call for main index page
app.get('/signup', controll.signup);//call for signup page
app.post('/signup', controll.signup);//call for signup post 
app.get('/login', controll.login);//call for login page
app.post('/login', controll.login);//call for login post
app.get('/books/library', controll.library);//call for ajax url page
app.get('/books', controll.books);//call for index book page
app.post('/books', controll.books_post);//call for book post
app.post('/books/details', controll.book_action);//call for book detail post
app.get('/books/details', controll.book_detail);//call for book detail page
app.get('/user_profile', controll.user_detail);//call for user profile page
app.post('/user_profile', controll.user_post);//call for user profile post
app.get('/logout', controll.logout);//call for logout

//Middleware
app.listen(8080)
