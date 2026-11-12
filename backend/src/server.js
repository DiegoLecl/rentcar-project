const env = require('./config/env');
const app = require('./app');

if (!env.jwtSecret) {
  console.error('Defina JWT_SECRET no arquivo .env');
  process.exit(1);
}

app.listen(env.port, () => {
  console.log(`API RentCar rodando na porta ${env.port}`);
});
