var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	firstname: {
		type: String
    },
    lastname: {
        type: String
    },
    // weird types
    dob: {
        type: Date,
        default: Date.now
    },
    propic: {
        type: Buffer
    },
    gender: {
        type: Boolean
    },
    age: {
        type: Number,
        min: 18,
        max: 55
    },
    distance: {
        type: Number,
        min: 1,
        max: 30
    },
    interestedin: {
        type: String
    },
    about: {
        type: String
    },
    interests: {
        type: Array
    }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(username, user, callback){
    var query = { username: username };
    var update = {
        //firstname: user.firstname,
        //lastname: user.lastname,
        propic: user.propic,
        //username: user.username,
        gender: user.gender,
        interestedin: user.interestedin,
        dob: user.dob,
        age: user.age,
        distance: user.distance,
        interests: user.interests,
        about: user.about
    }
    User.findOneAndUpdate(query, update, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}