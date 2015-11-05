// Invoke 'strict' JavaScript mode
'use strict';

var mongoose = require('mongoose'),
	crypto = require('crypto');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName : String,
	lastName : String,
	email: 
	{
		type: String,
		index: true,
		match: /.\@.+\../
	},
	website: 
	{
		type: String,
		set: function(url)
		{
			if (!url)
			{
				return url;
			}
			else 
			{
				if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0)
				{
					url = 'http://' + url;
				}

				return url;
			}
		}
	},
	role:
	{
		type: String,
		enum: ['Admin, Owner, User']
	},
	username: 
	{
		type: String, 
		unique: true,
		required: 'Username is required',
		trim: true
	},
	password:
	{
		type: String,
		validate:
		[
			function(password)
			{
				return password && password.length >= 6;
			},
			'Error Saving: Password is less than 6 characters in length'
		]
	},
	salt:
	{
		type: String
	},
	provider:
	{
		type: String,
		required: 'provider is required'
	},
	providerId: String,
	providerData: {},
	created:
	{
		type: Date, 
		default: Date.now
	}
});

UserSchema.virtual('fullName').get(function()
{
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName)
{
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// Static Method
UserSchema.statics.findOneByUsername = function(username, callback)
{
	this.findOne({ username: new RegExp(username, 'i') }, callback);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback)
{
	var  _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne(
	{
		username: possibleUsername
	},
	function(err, user)
	{
		if(!err)
		{
			if(!user)
			{
				callback(possibleUsername);
			}
			else
			{
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}

		}
		else
		{
			callback(null);
		}

	});
}

//Instance Method
UserSchema.methods.authenticate = function(password)
{
	return this.password === this.hashPassword(password);
};

UserSchema.methods.hashPassword = function(password)
{
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

//Called before a document is saved to the database. Can be used for complex valudation. Is an instance method
UserSchema.pre('save', function(next) 
{

	if (this.password)
	{
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next()


});

// Called after the document has been saved to the database. Usefull for logging. Is an instance method
UserSchema.post('save', function(next) 
{
	if (this.isNew)
	{
		console.log("A new user was created");
	}
	else
	{
		console.log("A user updated it's details");
	}
});

UserSchema.set('toJSON', { getters: true, virtuals: true } );



mongoose.model('User', UserSchema);

