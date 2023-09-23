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


router.get('/facebook' , passport.authenticate('facebook',{
    session: false
}))

router.get('/facebook/redirect', passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false
}), (req, res) => {
    if (req.user) {
        const token = jwt.sign({ _id: req.user._id, role: req.user.role }, "your-secret-key");
        res.header("token", token);
        res.cookie("jwt", token);
        res.status(200).json({ msg: "This is the redirect page" });
    } else {
        res.status(401).json({ error: "Authentication failed" });
    }
});
module.exports = router