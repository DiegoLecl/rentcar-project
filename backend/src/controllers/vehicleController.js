const vehicleService = require('../services/vehicleService');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  res.json(await vehicleService.list(req.query.status));
});

exports.getById = asyncHandler(async (req, res) => {
  res.json(await vehicleService.getById(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await vehicleService.create(req.body));
});

exports.update = asyncHandler(async (req, res) => {
  res.json(await vehicleService.update(req.params.id, req.body));
});

exports.remove = asyncHandler(async (req, res) => {
  await vehicleService.remove(req.params.id);
  res.status(204).send();
});
