// Invoke 'strict' JavaScript mode
'use strict';

var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function(){
	var db = mongoose.connect(config.db);

	require('../server/models/user.server.model');
	require('../server/models/article.server.model');
	
	return db;
};
