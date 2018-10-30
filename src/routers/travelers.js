const router = require('express-promise-router')();

const {
  showTraveler,
  newTraveler
} = require('../controllers/traveler');

router.get('/',showTraveler);
router.post('/',newTraveler);

module.exports = router;
