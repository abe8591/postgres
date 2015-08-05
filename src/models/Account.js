// Models Account.js
var AccountModule = (function() {
	var crypto = require('crypto');
	var pg = require('pg');

	var iterations = 10000;
	var saltLength = 64;
	var keyLength = 64;

	var AccountSchema = function(username, password, id){
   	 	username: username, 
		password: password,
		id: id,
		date: new Date().getNow()
	};

	var validatePassword = function(password, callback) {
		var pass = this.password;
	
		crypto.pbkdf2(password, this.salt, iterations, keyLength, function(err, hash) {
			if(hash.toString('hex') !== pass) {
				return callback(false);
			}
			return callback(true);
		});
	};

	var findByUsername = function(name, callback) {

    	var search = {
        	username: name
    	};
	};

	var generateHash = function(password, callback) {
		var salt = crypto.randomBytes(saltLength);
	
		crypto.pbkdf2(password, salt, iterations, keyLength, function(err, hash){
			return callback(salt, hash.toString('hex'));
		});
	};

	var authenticate = function(username, password, callback) {
	
	};
	
	return {
		AccountSchema: AccountSchema	
	};
	
})();


module.exports.AccountModule = AccountModule;