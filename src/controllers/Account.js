var AccountController = (function() {
	//var models = require('../models/Account.js');

	//var Account = models.AccountModule;
	
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
        		return res.status(400).json({error: "All fields are required"});
    		}
			res.redirect('/postgres');

		},

		signup: function(req, res) {

    		if(!req.body.username || !req.body.pass || !req.body.pass2) {
        		return res.status(400).json({error: "All fields are required"});
    		}

    		if(req.body.pass !== req.body.pass2) {
        		return res.status(400).json({error: "Passwords do not match"});
    		}
			res.redirect('/postgres');
			
		}
	};
})();

module.exports = AccountController;