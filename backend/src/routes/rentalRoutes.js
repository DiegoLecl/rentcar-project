const router = require('express').Router();
const rentalController = require('../controllers/rentalController');
const authenticate = require('../middlewares/auth');

router.use(authenticate);

router.post('/', rentalController.create);
router.get('/', rentalController.list);
router.get('/:id', rentalController.getById);
router.patch('/:id/return', rentalController.giveBack);

module.exports = router;
