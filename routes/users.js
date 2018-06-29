var express = require('express');
var router = express.Router();
require('express-ws')(router);

// chatting
var nextId = 1;
var clients = {};
router.ws('/chat', function(ws, req) {
	var clientId = nextId;
	clients[clientId] = {ws: ws};
	nextId++;
	ws.on('message', function(msgString) {
		var inMsg = JSON.parse(msgString);
		var outMsg = JSON.stringify({
			clientId: clientId,
			message: inMsg.message
		});
		Object.keys(clients).forEach(function(clientId) {
			clients[clientId].ws.send(outMsg);
		});
	});
});
//

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//for image upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Update profile
router.get('/update', function (req, res) {
    res.render('profile');
})

// Register User
router.post('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
                        firstname: firstname,
                        lastname: lastname,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	        req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

//update profile
router.post('/update', upload.any(), function(req, res) {

    var propic = req.body.propic;
    //var firstname = req.body.firstname;
    //var lastname = req.body.lastname;
    //var email = req.body.email;
    var dob = req.body.dob;
    var username = req.body.username;
    var gender = req.body.gender;
    var lookingfor = req.body.lookingfor;
    var age = req.body.age; 
	var maxdistance = req.body.maxdistance; 
	var interestedin = req.body.interestedin;
    var interests = req.body.interests;
	//var password = req.body.password;
	//var password2 = req.body.password2;
	var about = req.body.about;

	console.log("did we even get here");

    // Validation
    //req.checkBody('propic', 'Please upload a profile picture to continue').notEmpty();
	// req.checkBody('password', 'Password is required').notEmpty();
    // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('dob', 'Date of Birth is required').notEmpty();
    // req.checkBody('dob', 'Please input date format dd-mm-yyyy').isDate();
	req.checkBody('gender', 'Please Specify your gender').notEmpty();

	var errors = req.validationErrors();
	console.log(errors);

	if (errors) {
	 	res.render('profile', {
	 		errors: errors
	 	});
    }
	else {
	    var updateUser = new User({
            propic: Buffer('340b0da2246d953f085d75f17c585671'),
            //firstname: firstname,
            //lastname: lastname,
	        //email: email,
			username: username,
            //password: password,
            dob: dob,
 	        gender: gender,
			lookingfor: lookingfor,
			age: age,
            maxdistance: maxdistance,
            interestedin: interestedin,
            interests: interests,
            about: about
		});
		User.updateUser(username, updateUser, function (err, user) {
			if (err) throw err;
	 		console.log(user);
		});
        req.flash('success_msg', 'Profile successfully updated');
		res.redirect('/');
	}	
});
//

passport.use(new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});



router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

router.get('/chat', function(req, res) {
 	res.render('chat');
});

module.exports = router;