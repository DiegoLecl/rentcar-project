const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');
const { serializeVehicle } = require('../utils/serializers');
const {
  requireString,
  requireInt,
  requirePositiveNumber,
  normalizePlate,
  parseId
} = require('../utils/validators');

const STATUSES = ['DISPONIVEL', 'ALUGADO', 'MANUTENCAO'];

function parseVehicle(body) {
  return {
    brand: requireString(body.brand, 'marca', 1, 50),
    model: requireString(body.model, 'modelo', 1, 50),
    year: requireInt(body.year, 'ano', 1990, new Date().getFullYear() + 1),
    plate: normalizePlate(body.plate),
    color: requireString(body.color, 'cor', 1, 30),
    dailyRate: requirePositiveNumber(body.dailyRate, 'valor da diária')
  };
}

async function findOrFail(id) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw new AppError(404, 'Veículo não encontrado');
  }
  return vehicle;
}

async function list(status) {
  const where = {};
  if (status) {
    if (!STATUSES.includes(status)) {
      throw new AppError(400, 'Status inválido');
    }
    where.status = status;
  }
  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { id: 'desc' } });
  return vehicles.map(serializeVehicle);
}

async function getById(idParam) {
  const vehicle = await findOrFail(parseId(idParam));
  return serializeVehicle(vehicle);
}

async function create(body) {
  const data = parseVehicle(body);
  const vehicle = await prisma.vehicle.create({ data });
  return serializeVehicle(vehicle);
}

async function update(idParam, body) {
  const id = parseId(idParam);
  const current = await findOrFail(id);
  const data = parseVehicle(body);

  if (body.status !== undefined && body.status !== current.status) {
    if (current.status === 'ALUGADO') {
      throw new AppError(409, 'Veículo alugado: registre a devolução antes de alterar o status');
    }
    if (!['DISPONIVEL', 'MANUTENCAO'].includes(body.status)) {
      throw new AppError(400, 'Status só pode ser DISPONIVEL ou MANUTENCAO');
    }
    data.status = body.status;
  }

  const vehicle = await prisma.vehicle.update({ where: { id }, data });
  return serializeVehicle(vehicle);
}

async function remove(idParam) {
  const id = parseId(idParam);
  await findOrFail(id);

  const rentals = await prisma.rental.count({ where: { vehicleId: id } });
  if (rentals > 0) {
    throw new AppError(409, 'Veículo possui locações registradas e não pode ser excluído');
  }

  await prisma.vehicle.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
