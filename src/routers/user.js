const router = require('express-promise-router')();

const {
  showUser
} = require('../controllers/user');

router.get('/',showUser);

module.exports = router;
