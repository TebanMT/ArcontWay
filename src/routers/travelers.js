const router = require('express-promise-router')();

const {
  showTraveler,
  singUp,
  getData
} = require('../controllers/traveler');

//router.get('/',showTraveler);
router.post('/',singUp);
router.get('/:id?',getData);
//router.post('/login',signIn);

module.exports = router;
