const router = require('express-promise-router')();

const {
  showTravel,
  newTravel
} = require('../controllers/travel');

router.get('/',showTravel);
router.post('/',newTravel);

module.exports = router;
