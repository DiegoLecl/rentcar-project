const router = require('express').Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/vehicles', require('./vehicleRoutes'));
module.exports = router;