# Guia de commits individuais

Objetivo: cada integrante publica sua parte com a própria conta do GitHub, em branch própria, e o Diego integra via Pull Request. Ninguém commita com a conta de outra pessoa e nenhuma data ou autor é alterado.

Cada um deve ler e entender os arquivos da sua parte antes de commitar, pois vai explicá-los ao professor. Confirmem também com o professor as regras da disciplina sobre ferramentas de apoio.

## Preparação (todos)

```bash
git config user.name "Seu Nome"
git config user.email "email-da-sua-conta-github@exemplo.com"
```

O e-mail precisa ser o mesmo cadastrado na sua conta GitHub, senão o commit não aparece como seu.

## Ordem de trabalho

1. **Diego** cria o repositório, adiciona os três colegas em Settings > Collaborators e faz a base na `main`.
2. **Glauco** envia a autenticação (os módulos de veículos e locações dependem do middleware dele).
3. **Evandro** e **Nycolas** trabalham em paralelo, a partir da `main` atualizada.
4. **Evandro** commita `VehicleDetails.jsx` depois do merge do Nycolas (usa o `RentalForm`).
5. **Diego** faz a integração final (rotas, dashboard, App) e a revisão.

## 1. Diego: base (direto na main)

Commits sugeridos, em ordem:

- `chore: cria estrutura do repositório` (.gitignore, README.md, CONTRIBUICAO.md)
- `feat(backend): configura Express, CORS e tratamento de erros` (package.json, config/, utils/, middlewares/errorHandler.js, app.js, server.js)
- `feat(backend): modela banco com Prisma e seed` (prisma/)
- `feat(frontend): estrutura base com Vite e estilos` (package.json, vite.config.js, index.html, index.css, services/api.js, utils/format.js)

Em `backend/src/routes/index.js`, deixe na base apenas a rota `/health`. As linhas `router.use(...)` dos módulos são adicionadas por cada integrante no seu PR (veja abaixo). O mesmo vale para os imports e rotas em `frontend/src/App.jsx`, que o Diego fecha na integração.

```bash
git init
git add .
git commit -m "mensagem"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

## 2. Glauco: branch `feature/auth`

Arquivos:

- backend: `services/authService.js`, `controllers/authController.js`, `routes/authRoutes.js`, `middlewares/auth.js`, `middlewares/authorize.js`, `requests/auth.http`
- frontend: `services/authService.js`, `context/AuthContext.jsx`, `components/PrivateRoute.jsx`, `pages/Login.jsx`, `pages/Register.jsx`
- em `routes/index.js`: `router.use('/auth', require('./authRoutes'));`

```bash
git clone URL_DO_REPOSITORIO
cd rentcar
git checkout -b feature/auth
git add backend/src/middlewares
git commit -m "feat(auth): middlewares de autenticação JWT e autorização por perfil"
git add backend/src/services/authService.js backend/src/controllers/authController.js backend/src/routes/authRoutes.js
git commit -m "feat(auth): cadastro e login com bcrypt e JWT"
git add frontend/src
git commit -m "feat(auth): telas de login e cadastro e contexto de autenticação"
git push -u origin feature/auth
```

Depois abra o Pull Request no GitHub.

## 3. Evandro: branch `feature/vehicles`

Arquivos:

- backend: `services/vehicleService.js`, `controllers/vehicleController.js`, `routes/vehicleRoutes.js`, `requests/vehicles.http`
- frontend: `services/vehicleService.js`, `components/StatusBadge.jsx`, `components/VehicleCard.jsx`, `pages/Vehicles.jsx`, `pages/VehicleForm.jsx`, `pages/VehicleDetails.jsx`
- em `routes/index.js`: `router.use('/vehicles', require('./vehicleRoutes'));`

Faça commits separados por etapa (service, controller e rotas, telas) e rode os testes de `requests/vehicles.http` antes de abrir o PR.

## 4. Nycolas: branch `feature/rentals`

Arquivos:

- backend: `services/rentalService.js`, `controllers/rentalController.js`, `routes/rentalRoutes.js`, `requests/rentals.http`
- frontend: `services/rentalService.js`, `components/RentalForm.jsx`, `pages/Rentals.jsx`
- em `routes/index.js`: `router.use('/rentals', require('./rentalRoutes'));`

## 5. Diego: integração final

Branch `feature/integracao`: `services/dashboardService.js`, `controllers/dashboardController.js`, `routes/dashboardRoutes.js` (e a linha do `/dashboard` em `routes/index.js`), `frontend/src/main.jsx`, `App.jsx`, `components/Layout.jsx`, `components/Navbar.jsx`, `pages/Dashboard.jsx`, `services/dashboardService.js`. Em seguida testa os fluxos completos e corrige o que aparecer.

Conflitos em `routes/index.js` são esperados (todos editam o arquivo): mantenha todas as linhas `router.use`.

## Conferência

Antes de entregar, em `Insights > Contributors` ou com `git shortlog -sn` confirme que os quatro aparecem com commits.
