const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { requireString, requireEmail } = require('../utils/validators');

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function register(body) {
  const name = requireString(body.name, 'nome', 2, 100);
  const email = requireEmail(body.email);
  const password = requireString(body.password, 'senha', 6, 72);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, 'E-mail já cadastrado');
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash, role: 'CLIENTE' }
  });

  return publicUser(user);
}

async function login(body) {
  const email = requireEmail(body.email);
  const password = requireString(body.password, 'senha', 1, 72);

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) {
    throw new AppError(401, 'E-mail ou senha incorretos');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return { token, user: publicUser(user) };
}

module.exports = { register, login };
