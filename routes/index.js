var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./post")
const upload = require("./multer");

const localStrategy =  require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));




router.get('/', function(req, res, next) {
  res.render('index',{nav:true});
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav:true});
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  let user = 
  await userModel
         .findOne({username: req.session.passport.user })
         .populate("posts")
         
  res.render('profile',{user,nav:false});
});


router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user =  await userModel.findOne({username: req.session.passport.user })
 const posts = await postModel.find()       
     .populate("user")    
  res.render('feed',{user,posts,nav:false});
});

router.get('/add', isLoggedIn, async function(req, res, next) {
  let user = await userModel.findOne({username: req.session.passport.user });
  res.render('add',{user,nav:true});
});

router.post('/createpost', isLoggedIn, upload.single("postimage") ,async function(req, res, next) {
  let user = await userModel.findOne({username: req.session.passport.user });
  const post = await postModel.create({
    user: user._id,
    title : req.body.title,
    description: req.body.description,
    image : req.file.filename
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/uploadfile', isLoggedIn, upload.single("image") , async function(req, res, next) {
 let user = await userModel.findOne({username: req.session.passport.user });
 user.profileImage = req.file.filename;
 await user.save();
 res.redirect("/profile");
});


router.post('/register', async function(req, res, next) {
  try {
    let userdata = new userModel({
      username: req.body.username,
      name: req.body.name,  
      email: req.body.email,
      contact: req.body.contact
    });

    
    let registeredUser = await userModel.register(userdata, req.body.password);

    passport.authenticate("local")(req, res, function() {
      res.redirect("/profile");
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.redirect("/register");
  }
});



router.post('/login',passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/"
}) ,function(req, res, next) {

});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error("Logout error:", err);
          return res.status(500).send("Error logging out");
      }
      res.redirect("/"); 
  });
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { 
    return next();
  }
  res.redirect("/");
}


module.exports = router;
