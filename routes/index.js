var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', checkAuthentication, function(req, res){
	//
	
	var gender = {gender: gender};

// res.send(result, {
//     gender: gender});

	res.render('index', {
		gender: gender});

});

function checkAuthentication(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;