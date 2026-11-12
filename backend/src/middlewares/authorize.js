const AppError = require('../utils/AppError');

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'Acesso negado'));
    }
    return next();
  };
}

module.exports = authorize;
