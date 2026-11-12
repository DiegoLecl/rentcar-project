require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const vehicles = [
  { brand: 'Toyota', model: 'Corolla', year: 2022, plate: 'ABC1D23', color: 'Prata', dailyRate: 150 },
  { brand: 'Honda', model: 'Civic', year: 2021, plate: 'DEF2G45', color: 'Preto', dailyRate: 160 },
  { brand: 'Volkswagen', model: 'Gol', year: 2020, plate: 'GHI3J67', color: 'Branco', dailyRate: 90 },
  { brand: 'Fiat', model: 'Argo', year: 2023, plate: 'JKL4M89', color: 'Vermelho', dailyRate: 110 }
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@rentcar.com').toLowerCase();
  const name = process.env.ADMIN_NAME || 'Administrador';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, password: hash, role: 'ADMIN' }
  });

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { plate: vehicle.plate },
      update: {},
      create: vehicle
    });
  }

  console.log('Seed concluído. Administrador:', email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
