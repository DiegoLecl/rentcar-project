const prisma = require('../config/prisma');

async function stats(user) {
  const rentalWhere = user.role === 'ADMIN' ? {} : { userId: user.id };

  const [total, disponivel, alugado, manutencao, rentalsTotal, ativas, finalizadas] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'DISPONIVEL' } }),
      prisma.vehicle.count({ where: { status: 'ALUGADO' } }),
      prisma.vehicle.count({ where: { status: 'MANUTENCAO' } }),
      prisma.rental.count({ where: rentalWhere }),
      prisma.rental.count({ where: { ...rentalWhere, status: 'ATIVA' } }),
      prisma.rental.count({ where: { ...rentalWhere, status: 'FINALIZADA' } })
    ]);

  return {
    vehicles: { total, disponivel, alugado, manutencao },
    rentals: { total: rentalsTotal, ativas, finalizadas }
  };
}

module.exports = { stats };
