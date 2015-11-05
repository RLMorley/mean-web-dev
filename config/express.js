// Invoke 'strict' JavaScript mode
'use strict';

var config = require('./config'),
	http = require('http'),
	socketio = require('socket.io'),
	express = require('express'), 
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'), 
	session = require("express-session"),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport');


module.exports = function(db)
{
	var app = express();

	var server = http.createServer(app);
	var io = socketio.listen(server);

	if (process.env.NODE_ENV === 'development')
	{
		app.use(morgan('dev'));
	}
	else if (process.env.NODE_ENV === 'production')
	{
		app.use(compress());
	}

	app.use(bodyParser.urlencoded(
	{
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());



		// Configure the MongoDB session storage
	var mongoStore = new MongoStore({
        mongooseConnection: db.connection
    });


	// Configure the 'session' middleware
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore
	}));

	app.set('views', './server/views');
	app.set('view engine', 'ejs');

	app.use(flash());

	app.use(passport.initialize());
	app.use(passport.session());


	require('../server/routes/index.server.routes.js')(app);
	require('../server/routes/users.server.routes.js')(app);
	require('../server/routes/articles.server.routes.js')(app);

	app.use(express.static('./public'));

	require('./socketio.js')(server, io, mongoStore);

	return server;
};
