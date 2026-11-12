const router = require('express').Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/vehicles', require('./vehicleRoutes'));
router.use('/auth', require('./authRoutes'));
module.exports = router;