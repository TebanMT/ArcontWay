const router = require('express-promise-router')();

const {
  showUser,
  isSignUpTraveler
} = require('../controllers/user');

router.get('/',showUser);
router.get('/traveler',isSignUpTraveler);

module.exports = router;
