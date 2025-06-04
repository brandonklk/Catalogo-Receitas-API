
# 📚 Catálogo de Receitas


Projeto desenvolvido com **NestJS** com o objetivo de gerenciar receitas culinárias e seus ingredientes, utilizando **TypeORM** com banco de dados **SQLite**. A aplicação segue princípios de Clean Code, arquitetura em camadas e SOLID.

---
  O objetivo deste projeto é fornecer uma API RESTful que permita:

-   Cadastrar receitas com múltiplos ingredientes
-   Listar receitas de forma paginada
-   Consultar receitas por ID
-   Reutilizar ingredientes já cadastrados (evitando duplicação)
-   Servir como base de estudo para boas práticas com NestJS e arquitetura limpa

---

  

## 🚀 Tecnologias Utilizadas

- [Node.js 22+](https://nodejs.org/)

- [NestJS](https://nestjs.com/)

- [TypeORM](https://typeorm.io/)

- [SQLite](https://www.sqlite.org/)

- [Jest](https://jestjs.io/) – Testes unitários

  

---

## 📚 Documentação da API

Foi utilizado o Swagger para documentar a API, para acessar a mesma acesse a seguinte URL:

```bash
http://localhost:3000/docs
```

---

  

## 📦 Como Executar o Projeto Localmente

  

1.  **Clone o repositório:**
```bash
git  clone  https://github.com/brandonklk/Catalogo-Receitas-API.git
```

2.  **Instale as dependências:**
```bash
npm run install
```

3.  **Configure as variáveis de ambiente:**
```bash
DB_TYPE=sqlite
DB_PATH=database.sqlite
DB_SYNCHRONIZE=true
```

4.  **Execute a aplicação:**
```bash
npm run start:dev
```

4.  **Api disponível:**
```bash
http://localhost:3000
```

---
## 🧪 Executando os Testes

1.  **Testes unitários**
```bash
npm run test
```
---
## ⚙️ Variáveis de Ambiente

```
DB_TYPE=sqlite
DB_PATH=database.sqlite
DB_SYNCHRONIZE=true
```

---
## 📁 Estrutura do Projeto

```
src/
├── app.module.ts
├── main.ts
├── common
│   ├── constants/
│   ├── dtos/
│   └── types/
├── database/
│   └── sqlite-config.ts
├── domain/
│   └── recipe
│        ├── controllers/
│        ├── dtos/
│        ├── entities/
│        ├── mappers/
│        ├── presenters/
│        ├── repositories/
│        └── use-cases/

```

---
## 🧑‍💻 Autor
Feito com por [Brandon Marcos Kluck](https://github.com/brandonklk)