var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var School = mongoose.model('School');
var User = mongoose.model('User');

//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if (req.method === "GET") {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/userinfo').get(function (req, res) {
    console.log("_-_---------------------------------");
    console.log("/userinfor", req.session);
    if (req.session.passport) {
        console.log("whlqeiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii---sd-s-d-s--ds-s-s-d-d-s-ds-sfd-d-s-")
        User.findById(req.session.passport.user, function (err, user) {
            res.send(user);
            req.isAuthenticated = true;
            console.log('DONE', user)
        });
    }
    else {
        console.log("Failed");
        req.isAuthenticated = false;
    }
});

router.route('/school')
    //creates a new post
    .post(function (req, res) {
        var school = new School();
        school.region = req.body.region;
        school.name = req.body.name;
        school.extra = req.body.extra;
        school.save(function (err, school) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(school);
        });
    })
    //gets all posts
    .get(function (req, res) {
        School.find(function (err, schools) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(schools);
        });
    });

//post-specific commands. likely won't be used
router.route('/schools/:id')
    //gets specified post
    .get(function (req, res) {
        console.log("d", req.params.id);
        School.findById(req.params.id, function (err, school) {
            if (err)
                res.send(err);
            res.json(school);
        });
    });
//updates specified post
/*.put(function(req, res){
 Post.findById(req.params.id, function(err, post){
 if(err)
 res.send(err);

 post.created_by = req.body.created_by;
 post.text = req.body.text;

 post.save(function(err, post){
 if(err)
 res.send(err);

 res.json(post);
 });
 });
 })*/
/*
 //deletes the post
 .delete(function(req, res) {
 Post.remove({
 _id: req.params.id
 }, function(err) {
 if (err)
 res.send(err);
 res.json("deleted :(");
 });
 });*/

module.exports = router;