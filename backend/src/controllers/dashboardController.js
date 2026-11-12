const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

exports.stats = asyncHandler(async (req, res) => {
  res.json(await dashboardService.stats(req.user));
});
