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

### Criar postagem

Abra `GET /criarPostagem` para acessar o formulário. Informe o e-mail de um usuário já cadastrado; o formulário envia os dados em JSON para `POST /criarPostagem`. O endpoint `POST /postagens` também está disponível para clientes que enviam JSON diretamente.

```json
{
  "titulo": "Minha primeira postagem",
  "conteudo": "Olá, microblog!",
  "email": "ana@example.com"
}
```

Em caso de sucesso, a API responde com `201 Created`. Campos inválidos retornam `400 Bad Request`; um e-mail que não corresponde a um usuário cadastrado retorna `404 Not Found`. A postagem continua armazenando internamente a referência ao usuário.

### Visualizar postagens e comentários

Abra `GET /visualizarPostagens` para ver e buscar postagens pelo título ou conteúdo. Cada cartão com título e conteúdo é um link para a página de detalhes, que exibe a postagem e seus comentários.

- `GET /postagens` retorna a lista de postagens; o parâmetro opcional `q` filtra por título ou conteúdo (exemplo: `/postagens?q=microblog`).
- `GET /visualizarPostagem/:id` exibe a página de detalhes.
- `GET /postagens/:id` retorna uma postagem e os comentários vinculados a ela.
- `PATCH /postagens/:id` edita o título e o conteúdo da postagem.
- `DELETE /postagens/:id` exclui a postagem e seus comentários vinculados.
- `POST /postagens/:id/comentarios` cadastra um comentário vinculado à postagem e a um usuário encontrado pelo e-mail.
- `PATCH /postagens/:id/comentarios/:comentarioId` edita um comentário.
- `DELETE /postagens/:id/comentarios/:comentarioId` exclui um comentário.

As rotas de edição e exclusão identificam postagens e comentários pelos IDs da URL. Excluir uma postagem também remove seus comentários vinculados. Como ainda não há autenticação, essas rotas não verificam a identidade de quem solicita a alteração.

Para cadastrar um comentário, envie `conteudo` e `email` em JSON:

```json
{
  "conteudo": "Ótima publicação!",
  "email": "ana@example.com"
}
```

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
│   │   ├── PostagemController.js
│   │   └── UsuarioController.js
│   ├── dao/
│   │   ├── ComentarioDao.js
│   │   ├── PostagemDao.js
│   │   └── UsuarioDao.js
│   ├── models/
│   │   ├── Comentario.js
│   │   ├── Postagem.js
│   │   └── Usuario.js
│   ├── public/
│   │   ├── cadastroUsuario.html
│   │   ├── criarPostagem.html
│   │   ├── visualizarPostagem.html
│   │   └── visualizarPostagens.html
│   ├── app.js
│   ├── package.json
│   └── server.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

- `app/models/`: schemas do Mongoose para as entidades do projeto.
- `app/controllers/`: recebe as requisições HTTP e coordena o cadastro de usuários e a criação de postagens.
- `app/dao/`: operações de acesso a dados para usuários, postagens e comentários.
- `app/config/db_mongoose.js`: configuração da conexão com o MongoDB.
- `docker-compose.yml` e `Dockerfile`: configuração dos containers de desenvolvimento.

## Status

Os modelos e as operações básicas de acesso a dados estão definidos. A API já possui formulários para cadastro de usuário, criação e visualização de postagens com comentários; as demais funcionalidades serão desenvolvidas ao longo do projeto.
