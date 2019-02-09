const router = require('express-promise-router')();

const {
  showDataAccountKit,
  sendCode
} = require('../controllers/authentication');

router.get('/', showDataAccountKit);
router.post('/', sendCode);


module.exports = router;
