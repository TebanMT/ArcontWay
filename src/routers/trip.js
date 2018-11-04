const router = require('express-promise-router')();

const {
  showTrip,
  newTrip
} = require('../controllers/trip');

router.get('/',showTrip);
router.post('/',newTrip);

module.exports = router;
