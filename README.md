# RentCar

Sistema web de gerenciamento de locação de veículos, desenvolvido como projeto final da disciplina Programação com Frameworks Web.

## Objetivo

Permitir que clientes consultem veículos e façam locações, e que administradores gerenciem a frota e acompanhem todas as locações, mantendo a disponibilidade dos veículos sempre consistente.

## Tecnologias

| Tecnologia | Função no projeto |
| --- | --- |
| Node.js | Ambiente de execução do backend |
| Express | Servidor HTTP, rotas e middlewares |
| JavaScript | Linguagem de todo o projeto (sem TypeScript) |
| Prisma ORM | Acesso ao banco, modelos e migrações |
| MySQL | Banco de dados relacional |
| JWT | Autenticação das requisições |
| bcryptjs | Hash de senhas com o algoritmo bcrypt |
| React (Vite) | Interface do usuário |

Observação: foi usado o pacote `bcryptjs` (implementação JavaScript do bcrypt) para evitar problemas de compilação nativa em Windows. O algoritmo é o mesmo.

## Funcionalidades

- Cadastro e login (e-mail e senha), perfis ADMIN e CLIENTE
- CRUD de veículos (somente ADMIN cadastra, edita e exclui)
- Locações com cálculo automático do valor no backend
- Devolução com liberação do veículo e bloqueio de devolução duplicada
- Dashboard com resumo da frota e das locações

## Regras de negócio

1. Veículo alugado ou em manutenção não pode ser alugado.
2. A devolução prevista deve ser posterior à retirada.
3. Valor total = diárias × valor da diária. O número de diárias é arredondado para cima, com mínimo de 1.
4. Ao criar a locação o veículo vira ALUGADO; ao devolver volta a DISPONIVEL (ambos em transação do Prisma).
5. Cliente só vê e devolve as próprias locações; ADMIN vê todas.
6. Todas as rotas, exceto cadastro e login, exigem token JWT.
7. Todos os dados recebidos pela API são validados.
8. Veículo com locações registradas não pode ser excluído.
9. Veículo alugado não tem o status alterado manualmente; apenas a devolução o libera.

## Integrantes

- Diego: estrutura do backend, configuração, integração e revisão final
- Glauco: autenticação, JWT e middlewares
- Evandro: módulo de veículos
- Nycolas: módulo de locações e devoluções

## Estrutura de pastas

```
rentcar/
├── backend/
│   ├── prisma/ (schema.prisma, seed.js)
│   ├── requests/ (arquivos .http para testar a API)
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        ├── services/
        ├── utils/
        ├── App.jsx
        └── main.jsx
```

## Modelo do banco de dados

- **User**: id, name, email (único), password (hash), role (ADMIN ou CLIENTE), createdAt
- **Vehicle**: id, brand, model, year, plate (única), color, dailyRate, status (DISPONIVEL, ALUGADO ou MANUTENCAO), createdAt, updatedAt
- **Rental**: id, userId, vehicleId, startDate, expectedReturnDate, returnedAt, totalPrice, status (ATIVA ou FINALIZADA), createdAt

Relações: um User tem várias Rental; um Vehicle tem várias Rental.

## Instalação

Pré-requisitos: Node.js 18 ou superior e MySQL em execução. O usuário do MySQL precisa de permissão para criar bancos (o `prisma migrate dev` usa um banco temporário).

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Migrações e dados iniciais:

```bash
npx prisma migrate dev --name init
npm run seed
```

Iniciar:

```bash
npm run dev
```

A API sobe em http://localhost:3001/api (teste em /api/health).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173. O Vite encaminha `/api` para o backend na porta 3001.

## Credenciais de demonstração

Criadas pelo `npm run seed`:

- Administrador: `admin@rentcar.com` / `admin123`
- Clientes: cadastre pela tela de cadastro

## Rotas da API

Base: `/api`. Rotas marcadas com token exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | /auth/register | público | Cadastra cliente |
| POST | /auth/login | público | Retorna token e usuário |
| GET | /vehicles | token | Lista veículos (filtro opcional `?status=`) |
| GET | /vehicles/:id | token | Detalhes do veículo |
| POST | /vehicles | ADMIN | Cadastra veículo |
| PUT | /vehicles/:id | ADMIN | Edita veículo |
| DELETE | /vehicles/:id | ADMIN | Exclui veículo |
| POST | /rentals | token | Registra locação |
| GET | /rentals | token | Lista locações (ADMIN: todas; cliente: as próprias) |
| GET | /rentals/:id | token | Detalhes da locação |
| PATCH | /rentals/:id/return | token | Registra devolução |
| GET | /dashboard | token | Resumo da frota e das locações |

Códigos usados: 400 dados inválidos, 401 sem autenticação, 403 sem permissão, 404 não encontrado, 409 conflito (veículo indisponível, devolução duplicada, placa ou e-mail duplicado).

## Decisões de projeto

- Cadastro público sempre cria CLIENTE; o ADMIN é criado pelo seed.
- Reserva e liberação do veículo usam `updateMany` condicional dentro de `$transaction`, o que impede duas locações simultâneas do mesmo veículo.
- Não há cálculo de multa por atraso: o valor é fixado na locação.
- Dados de teste e segredos ficam fora do repositório (`.env` está no `.gitignore`).
