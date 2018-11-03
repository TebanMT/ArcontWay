const router = require('express-promise-router')();
const isSignUp = require('../middlewares/user');

const {
  showTraveler,
  singUp,
  signIn
} = require('../controllers/traveler');

router.get('/',showTraveler);
router.post('/',isSignUp,singUp);
router.post('/login',signIn);

module.exports = router;
