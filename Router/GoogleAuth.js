const passport = require('passport')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});


router.get('/google' , passport.authenticate('google',{
    scope:['profile', 'email'],
    session: false
}))

router.get('/google/redirect' , passport.authenticate('google' ,{
    failureRedirect: '/',
    session: false
  }), (req,res)=>{
    const token = jwt.sign({ _id: req.user._id, role: req.user.role }, "your-secret-key");
    res.header("token", token);
    res.cookie("jwt", token);
    res.status(200).json({msg:"ths is redirect page"});
})
module.exports = router