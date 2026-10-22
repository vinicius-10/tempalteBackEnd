# Projeto 1 — Microblog

Projeto desenvolvido para a disciplina de **Programação Web Backend**. A proposta é criar o back-end de uma aplicação inspirada em plataformas de microblogging, permitindo que usuários publiquem e encontrem postagens.

## Objetivo

Praticar o desenvolvimento de uma aplicação back-end com Node.js, Express e MongoDB, organizando os dados em entidades relacionadas e disponibilizando funcionalidades para gerenciar usuários, postagens e comentários.

## Funcionalidades previstas

- Cadastro e consulta de usuários.
- Criação e consulta de postagens.
- Busca de publicações.
- Atualização e exclusão de postagens.
- Criação e consulta de comentários associados a usuários e postagens.

As funcionalidades representam o escopo do projeto; as rotas serão implementadas gradualmente.

## API

### Cadastrar usuário

Abra `GET /cadastroUsuario` para acessar o formulário. Ele valida os campos no navegador e envia os dados em JSON para `POST /cadastroUsuario`.

O endpoint `POST /usuarios` também está disponível para clientes que enviam JSON diretamente.

Envie um JSON com nome, e-mail, senha com pelo menos seis caracteres e a confirmação:

```json
{
  "nome": "Ana",
  "email": "ana@example.com",
  "senha": "minha-senha",
  "confirmarSenha": "minha-senha"
}
```

Em caso de sucesso, a API responde com `201 Created` e os dados públicos do usuário (a senha não é incluída):

```json
{
  "usuario": {
    "id": "id-do-usuario",
    "nome": "Ana",
    "email": "ana@example.com",
    "createdAt": "data-de-criacao"
  }
}
```

Dados obrigatórios ausentes ou inválidos retornam `400 Bad Request`. Um e-mail já cadastrado retorna `409 Conflict`.

## Entidades

| Entidade | Dados principais | Relacionamentos |
| --- | --- | --- |
| **Usuário** | Nome, e-mail e senha | Pode criar postagens e comentários |
| **Postagem** | Título e conteúdo | Pertence a um usuário |
| **Comentário** | Conteúdo | Pertence a um usuário e a uma postagem |

Os modelos utilizam timestamps para registrar as datas de criação e atualização.

## Tecnologias

- **Node.js** e **Express** para a aplicação back-end.
- **MongoDB** como banco de dados.
- **Mongoose** para definir os modelos e acessar o banco.
- **Docker Compose** para orquestrar a aplicação e o banco durante o desenvolvimento.

## Estrutura do projeto

```text
.
├── app/
│   ├── config/
│   │   └── db_mongoose.js
│   ├── controllers/
│   │   └── UsuarioController.js
│   ├── dao/
│   │   ├── ComentarioDao.js
│   │   ├── PostagemDao.js
│   │   └── UsuarioDao.js
│   ├── models/
│   │   ├── Comentario.js
│   │   ├── Postagem.js
│   │   └── Usuario.js
│   ├── app.js
│   ├── package.json
│   └── server.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

- `app/models/`: schemas do Mongoose para as entidades do projeto.
- `app/controllers/`: recebe as requisições HTTP e coordena o cadastro de usuários.
- `app/dao/`: operações de acesso a dados para usuários, postagens e comentários.
- `app/config/db_mongoose.js`: configuração da conexão com o MongoDB.
- `docker-compose.yml` e `Dockerfile`: configuração dos containers de desenvolvimento.

## Status

Os modelos e as operações básicas de acesso a dados estão definidos. A API já possui a rota de cadastro de usuário; as demais funcionalidades serão desenvolvidas ao longo do projeto.
