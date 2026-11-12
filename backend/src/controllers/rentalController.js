const rentalService = require('../services/rentalService');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await rentalService.create(req.user, req.body));
});

exports.list = asyncHandler(async (req, res) => {
  res.json(await rentalService.list(req.user));
});

exports.getById = asyncHandler(async (req, res) => {
  res.json(await rentalService.getById(req.user, req.params.id));
});

exports.giveBack = asyncHandler(async (req, res) => {
  res.json(await rentalService.giveBack(req.user, req.params.id));
});
