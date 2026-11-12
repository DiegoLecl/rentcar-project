const router = require('express').Router();
const vehicleController = require('../controllers/vehicleController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

router.use(authenticate);

router.get('/', vehicleController.list);
router.get('/:id', vehicleController.getById);
router.post('/', authorize('ADMIN'), vehicleController.create);
router.put('/:id', authorize('ADMIN'), vehicleController.update);
router.delete('/:id', authorize('ADMIN'), vehicleController.remove);

module.exports = router;
