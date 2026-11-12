const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');
const { serializeRental } = require('../utils/serializers');
const { requireDate, parseId } = require('../utils/validators');

const DAY_MS = 24 * 60 * 60 * 1000;

const rentalInclude = {
  vehicle: true,
  user: { select: { id: true, name: true, email: true } }
};

function calculateDays(start, end) {
  return Math.max(1, Math.ceil((end - start) / DAY_MS));
}

function assertAccess(rental, user) {
  if (user.role !== 'ADMIN' && rental.userId !== user.id) {
    throw new AppError(403, 'Acesso negado a esta locação');
  }
}

async function create(user, body) {
  const vehicleId = parseId(body.vehicleId);
  const startDate = requireDate(body.startDate, 'data de retirada');
  const expectedReturnDate = requireDate(body.expectedReturnDate, 'data de devolução');

  if (expectedReturnDate <= startDate) {
    throw new AppError(400, 'A data de devolução deve ser posterior à data de retirada');
  }

  const rental = await prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new AppError(404, 'Veículo não encontrado');
    }
    if (vehicle.status !== 'DISPONIVEL') {
      throw new AppError(409, 'Veículo indisponível para locação');
    }

    const claimed = await tx.vehicle.updateMany({
      where: { id: vehicleId, status: 'DISPONIVEL' },
      data: { status: 'ALUGADO' }
    });
    if (claimed.count === 0) {
      throw new AppError(409, 'Veículo indisponível para locação');
    }

    const days = calculateDays(startDate, expectedReturnDate);
    const totalPrice = Math.round(Number(vehicle.dailyRate) * days * 100) / 100;

    return tx.rental.create({
      data: { userId: user.id, vehicleId, startDate, expectedReturnDate, totalPrice },
      include: rentalInclude
    });
  });

  return serializeRental(rental);
}

async function list(user) {
  const where = user.role === 'ADMIN' ? {} : { userId: user.id };
  const rentals = await prisma.rental.findMany({
    where,
    include: rentalInclude,
    orderBy: { id: 'desc' }
  });
  return rentals.map(serializeRental);
}

async function getById(user, idParam) {
  const rental = await prisma.rental.findUnique({
    where: { id: parseId(idParam) },
    include: rentalInclude
  });
  if (!rental) {
    throw new AppError(404, 'Locação não encontrada');
  }
  assertAccess(rental, user);
  return serializeRental(rental);
}

async function giveBack(user, idParam) {
  const id = parseId(idParam);

  const rental = await prisma.$transaction(async (tx) => {
    const current = await tx.rental.findUnique({ where: { id } });
    if (!current) {
      throw new AppError(404, 'Locação não encontrada');
    }
    assertAccess(current, user);
    if (current.status !== 'ATIVA') {
      throw new AppError(409, 'Esta locação já foi devolvida');
    }

    const closed = await tx.rental.updateMany({
      where: { id, status: 'ATIVA' },
      data: { status: 'FINALIZADA', returnedAt: new Date() }
    });
    if (closed.count === 0) {
      throw new AppError(409, 'Esta locação já foi devolvida');
    }

    await tx.vehicle.update({
      where: { id: current.vehicleId },
      data: { status: 'DISPONIVEL' }
    });

    return tx.rental.findUnique({ where: { id }, include: rentalInclude });
  });

  return serializeRental(rental);
}

module.exports = { create, list, getById, giveBack };
