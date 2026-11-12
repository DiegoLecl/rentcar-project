const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(404, 'Rota não encontrada'));
}

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido' });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Já existe um registro com esse valor' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Erro interno do servidor' });
}

module.exports = { notFound, errorHandler };
