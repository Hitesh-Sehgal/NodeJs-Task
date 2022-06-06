let express = require('express'),
    router = express.Router(),
    userService = require('../Services/userService');
authHandler = require('../middleware/verifyToken');


/* User Signup */
router.post('/userSignup', (req, res) => {
    userService.signup(req.body, (data) => {
        res.send(data);
    });
});

/* User Login */
router.post('/userLogin', (req, res) => {
    userService.login(req.body, (data) => {
        res.send(data);
    });
});

/* Get User Profile */
router.get('/getProfile', authHandler.verifyToken, (req, res) => {
    userService.getProfile(req.headers, (data) => {
        res.send(data);
    });
});

/* Update Profile */
router.post('/updateProfile', authHandler.verifyToken, (req, res) => {
    userService.updateProfile(req.body, req.headers, (data) => {
        res.send(data);
    });
});


module.exports = router;