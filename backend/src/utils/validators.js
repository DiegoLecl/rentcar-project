const AppError = require('./AppError');

function requireString(value, field, min = 1, max = 100) {
  if (typeof value !== 'string') {
    throw new AppError(400, `Campo ${field} é obrigatório`);
  }
  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw new AppError(400, `Campo ${field} deve ter entre ${min} e ${max} caracteres`);
  }
  return text;
}

function requireEmail(value) {
  const email = requireString(value, 'e-mail', 5, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError(400, 'E-mail inválido');
  }
  return email;
}

function requireInt(value, field, min, max) {
  const number = Number(value);
  if (value === '' || value === null || value === undefined || !Number.isInteger(number) || number < min || number > max) {
    throw new AppError(400, `Campo ${field} deve ser um número inteiro entre ${min} e ${max}`);
  }
  return number;
}

function requirePositiveNumber(value, field) {
  const number = Number(value);
  if (value === '' || value === null || value === undefined || !Number.isFinite(number) || number <= 0 || number > 100000) {
    throw new AppError(400, `Campo ${field} deve ser um número positivo`);
  }
  return Math.round(number * 100) / 100;
}

function requireDate(value, field) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    throw new AppError(400, `Campo ${field} é inválido`);
  }
  return date;
}

function normalizePlate(value) {
  const plate = requireString(value, 'placa', 7, 8).toUpperCase().replace('-', '');
  if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate)) {
    throw new AppError(400, 'Placa inválida. Use o formato ABC1234 ou ABC1D23');
  }
  return plate;
}

function parseId(value) {
  return requireInt(value, 'id', 1, 2147483647);
}

module.exports = {
  requireString,
  requireEmail,
  requireInt,
  requirePositiveNumber,
  requireDate,
  normalizePlate,
  parseId
};
