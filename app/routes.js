module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    //same as read request
    app.get('/', function(req, res) {
    //making a get request to main pg which is going to respond with below from the request
        res.render('index.ejs');
        //we are responding with the index.ejs in the html
    });
    //goes to main pg and runs function that renders new pg 

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      //we are making a get request to the profile directory
        db.collection('answers').find({email: req.user.local.email}).toArray((err, result) => {
          //going into db coll mess to find messages and filter them into an array
          if (err) return console.log(err)
          res.render('profile.ejs', {
            //we are responding with rendering profile.ejs 
            user : req.user,
            users: result
            //these are the different documents in the db, req.user has information from user and messages is the array of messages
          })
        })
    });
    //getting is the same as reading
    //we are directing to the profile page, going into the collection messages and turning all input from form into a array
    //then its rendering a new page and 

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
      //getting logout directory
        req.logout();
        //user is requesting to logout of account
        res.redirect('/');
        //we are responding with directing them back to the home page since they are now logged out
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => { //or maybe should be messages
      //post is creating, when we input the information
      //we are creating in the messages directory
      // console.log(req.user.local.email, 'emfkj')
      console.log(req.body)
      db.collection('answers').save({email: req.user.local.email, answers: req.body.answers}, (err, result) => {
        //we are going into our collections and saving/posting the information passed into the documents and their value above 
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
        //we are directing them to the profile page 
      })
    })

    app.put('/messages', (req, res) => { //or maybe messages
      //put is updating the directory/pg
      db.collection('users')
      //going into the collection of msgs
      .findOneAndUpdate({answers: req.body.answers}, {
        //finding and updating the name and message
        // $set: {
        //   thumbUp:req.body.thumbUp + 1 //why +1?
          //set is a methof that is increasing thumbup by 1 in the req.body of that specific document
        // }
      }, {
        sort: {_id: -1},
        //reads js from top to bottom
        upsert: true //what's this?
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        //responding with the result of clicking on the thumbs up and updating?
      })
    })

    app.delete('/messages', (req, res) => {
      //this api request deletes messages
      db.collection('users').findOneAndDelete({answers: req.body.answers}, (err, result) => {
        //going into db, collection messages and finding and deleting the selected documents
        if (err) return res.send(500, err)
        res.send('Message deleted!')
        //once it's deleted, it'll say message deleted
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
          //getting is reading 
            res.render('login.ejs', { message: req.flash('loginMessage') });
            //we are responding with the rendered ejs that holds the document message and will flash a login message
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
          //post is creating in the login directory under passport
            successRedirect : '/profile', // redirect to the secure profile section
            //if right info, will be directed to their profile
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
          //reading signup pg
            res.render('signup.ejs', { message: req.flash('signupMessage') });
            //rendering the signup pg //message is a document requesting a flash message
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
          //post creates signup pg under passport
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
      //rading the unlink directory
        var user            = req.user;
        //setting user to request via the specific user 
        user.local.email    = undefined;
        //gets email
        user.local.password = undefined;
        //gets pw
        user.save(function(err) {
          //saves info from user collection
            res.redirect('/profile');
            //responds with directing user to their profile pg
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
    //redirects to home page
}
