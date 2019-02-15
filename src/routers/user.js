const router = require('express-promise-router')();

const {
  showUser,
  signUpByNumberPhone
} = require('../controllers/user');

router.get('/',showUser);
router.post('/',signUpByNumberPhone);

module.exports = router;
