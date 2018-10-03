var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var mongoose = require('mongoose');

// initialize cache on server start for the sessions
var sessions_cache = []

function checkSession (token) {
	for(i = 0; i < sessions_cache.length; i++) {
		if (token == sessions_cache[i].session) {
			//found a match, stop iterating
			return sessions_cache[i].username
		}
	}
	return false
}
function searchGiphies (query) {
	return new Promise (function(resolve,reject) {
		xhr = new XMLHttpRequest();
		xhr.open("GET","https://api.giphy.com/v1/gifs/search?api_key=88JnuJAUdDjh4JCPAuideIAV9DqBKZRV&q="+query+"&rating=g&limit=12");
		xhr.onload = function(){resolve(xhr.responseText)};
		xhr.onerror = function(){reject(xhr.status)};
		xhr.send()
	});
};

// add new session to cache and return session token
function getToken (username) {
	//generate token with crypto
	var token = crypto.randomBytes(64).toString('hex');
	var session = {username: username, session: token}
	sessions_cache.push(session)
	return token
};
// END FUNCTIONS BLOCK

//ENDPOINTS
router.post('/search-giphies', function (req, res) {
	if (!checkSession(req.headers.authtoken)) {
		res.status(401)
		res.send()
		return
	}
	searchGiphies(req.body.term).then(function(data) {
		res.send(data);
	});
});

//endpoint for authenticating user login attempt
router.post('/user-login', function (req, res) {
	// query db for account by username and password from req.body
	mongoose.model('accounts').find(req.body, function(err, accounts) {
		if (!accounts.length || err) {
			res.status(401)
			res.send()
			return;
		} else {
			data = {}
			data.token = getToken(req.body.username)
			res.send(data)
		}
	})
});

//endpoint for new user registration
router.post('/register', function (req, res) {
	mongoose.model('accounts').create(req.body, function(err, account) {
		if (err) {
			res.statusCode = 400;
			res.send();
			return;
		}
		res.statusCode = 201;
		res.send();
	})
});

//get account
router.get('/account', function(req, res, next) {
	//get username from session_cache by token
	username = checkSession(req.headers.authtoken)
	if (!username) {
		res.status(401)
		res.send()
		return
	}
	mongoose.model('accounts').find({'username': username}, function(err, accounts) {
		res.send(accounts[0]);
	})
});

//update favorites
router.put('/favorites', function(req, res, next) {
	//get username from session_cache by token
	username = checkSession(req.headers.authtoken)
	if (!username) {
		res.status(401)
		res.send()
		return
	}
	mongoose.model('accounts').update(
		{'username': username},
		{ $set: { favorites: req.body.favorites }},
		function(err, accounts) {
			if (err) {
				res.statusCode = 400;
				res.send();
				return;
			}
			res.send();
		}
	)
});

//update categories
router.put('/categories', function(req, res, next) {
	//get username from session_cache by token
	username = checkSession(req.headers.authtoken)
	if (!username) {
		res.status(401)
		res.send()
		return
	}
	mongoose.model('accounts').update(
		{'username': username},
		{ $set: { categories: req.body.categories }},
		function(err, accounts) {
			if (err) {
				res.statusCode = 400;
				res.send();
				return;
			}
			res.send();
		}
	)
});

module.exports = router;