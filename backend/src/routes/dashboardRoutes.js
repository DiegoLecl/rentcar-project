const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, dashboardController.stats);

module.exports = router;
