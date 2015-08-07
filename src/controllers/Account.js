var AccountController = (function() {
	var io = require('socket.io');
	var socket = io();
	return {
		loginPage: function(req, res) {
    		res.render('login');
		},
		
		signupPage: function(req, res) {
    		res.render('signup');
		},
		
		logout: function(req, res) {
    		req.session.destroy();
    		res.redirect('/');
		},

		login: function(req, res) {
			
    		var username = req.body.username;
    		var password = req.body.pass;

    		if(!username || !password) {
        		return res.status(400).send("<h3>One or more fields was not filled in.</h3>");
    		} else {
				res.redirect('/postgres');
			}
			//socket.emit('checkUser', {username:username, password:password});
		},

		signup: function(req, res) {

    		if(!req.body.username || !req.body.pass || !req.body.pass2) {
				return res.status(400).send("<h3>One or more fields was not filled in.</h3>");
    		}else if(req.body.pass !== req.body.pass2) {
				return res.status(400).send("<h3>Password and Confirm Password do not match.</h3>");
    		} else {
				res.redirect('/postgres');
			}
			
		}
	};
})();

module.exports = AccountController;