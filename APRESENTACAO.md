# Roteiro de apresentação

## Preparação

1. Banco criado, `.env` configurado, `npx prisma migrate dev --name init` e `npm run seed` executados.
2. Backend (`npm run dev`) e frontend (`npm run dev`) rodando.
3. Duas abas do navegador: uma para o administrador, outra (janela anônima) para o cliente.

## Demonstração

1. **Cadastro**: criar um cliente na tela de cadastro.
2. **Login e JWT**: entrar como cliente; mostrar o token em DevTools > Application > Local Storage.
3. **Cadastro de veículo**: entrar como admin (`admin@rentcar.com` / `admin123`) e cadastrar um veículo. Mostrar que o cliente não vê o botão de cadastro.
4. **Consulta**: listar veículos, usar o filtro de status e abrir os detalhes.
5. **Locação**: como cliente, escolher um veículo disponível, informar datas, conferir a estimativa e confirmar. O veículo passa a ALUGADO.
6. **Tentativa de locar veículo alugado**: abrir o mesmo veículo e tentar alugar novamente; a API responde 409 "Veículo indisponível para locação".
7. **Devolução**: em Locações, clicar em "Registrar devolução".
8. **Disponibilidade**: voltar em Veículos; o veículo está DISPONÍVEL e a locação FINALIZADA. Tentar devolver de novo não é possível (botão some; via API retorna 409).

Extra: como admin, mostrar que Locações exibe todos os clientes.

## O que cada tecnologia faz

- **Node.js**: executa JavaScript no servidor.
- **Express**: recebe as requisições HTTP e as direciona para rotas, middlewares e controllers.
- **Prisma**: traduz o código JavaScript em consultas SQL e controla a estrutura do banco por migrações.
- **MySQL**: guarda usuários, veículos e locações.
- **JWT**: token assinado que o servidor entrega no login; o cliente o envia em cada requisição para provar quem é.
- **bcrypt**: transforma a senha em hash; a senha original nunca é guardada.
- **React**: monta as telas e consome a API.

## Trechos principais por integrante

- **Diego**: `app.js` (middlewares e rotas), `prisma/schema.prisma` (modelo), `middlewares/errorHandler.js`, `services/api.js` (envia o token em toda chamada).
- **Glauco**: `middlewares/auth.js` (valida o token e preenche `req.user`), `middlewares/authorize.js` (checa o perfil), `authService.js` (hash e comparação de senha, geração do JWT).
- **Evandro**: `vehicleService.js` (`parseVehicle` valida os dados; `update` impede mudar o status de veículo alugado; `remove` bloqueia exclusão com histórico).
- **Nycolas**: `rentalService.js` (`create`: transação que reserva o veículo e calcula o total; `giveBack`: transação que finaliza a locação e libera o veículo; `assertAccess`: cliente só acessa as próprias locações).
