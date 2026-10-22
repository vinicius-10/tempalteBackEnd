# Projeto 1 — Microblog

Back-end de uma aplicação de microblog desenvolvida para a disciplina de **Programação Web Backend**. Usuários podem publicar textos, encontrar publicações e interagir por meio de comentários.

## Integrante

- Vinícius Souza Dias — [@vinicius-10](https://github.com/vinicius-10)

## Descrição

A aplicação oferece uma API HTTP e páginas HTML simples para cadastrar usuários, criar e buscar postagens, visualizar detalhes e gerenciar comentários vinculados às publicações. Os dados são armazenados no MongoDB usando Mongoose.

## Entidades e classes implementadas

| Entidade | Campos principais | Relacionamentos |
| --- | --- | --- |
| **Usuario** | Nome, e-mail e senha | Pode criar postagens e comentários |
| **Postagem** | Título e conteúdo | Pertence a um usuário |
| **Comentario** | Conteúdo | Pertence a um usuário e a uma postagem |

Os schemas estão em `app/models/`; o acesso ao banco é organizado pelos DAOs em `app/dao/`; os endpoints são tratados pelos controllers em `app/controllers/`.

## Funcionalidades

- Cadastro de usuários com validação de e-mail e senha.
- Criação de postagens associadas a usuários identificados por e-mail.
- Listagem e busca de postagens por título ou conteúdo.
- Visualização individual da postagem e dos comentários vinculados.
- Edição e exclusão de postagens.
- Criação, edição e exclusão de comentários.
- Remoção dos comentários vinculados ao excluir uma postagem.

> A aplicação ainda não possui autenticação. As rotas de edição e exclusão não verificam a identidade de quem as solicita.

## Tecnologias

- Node.js 20 ou superior.
- npm.
- Express.
- MongoDB Atlas.
- Mongoose.
- Docker Desktop com Docker Compose (para execução containerizada).

## Requisitos para executar

Escolha uma das formas de execução:

- **Com Docker:** Docker Desktop instalado e em execução, com Docker Compose disponível.
- **Localmente:** Node.js 20 ou superior e npm instalados.
- **Banco de dados:** uma instância MongoDB Atlas acessível pela rede. O serviço MongoDB local do `docker-compose.yml` está desativado; o Compose executa a aplicação Node.js e usa o Atlas configurado no `.env`.

## Configuração do MongoDB Atlas

1. Crie uma conta e um cluster no [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Crie um usuário de banco de dados e defina uma senha.
3. Em **Network Access**, autorize o endereço IP da máquina que executará a aplicação.
4. No cluster, escolha **Connect** e copie a connection string para Node.js.
5. Substitua o usuário, a senha e o cluster na URI. Inclua o nome do banco, por exemplo:

   ```text
   mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority
   ```

   Se a senha contiver caracteres especiais, faça o URL encoding desses caracteres.

Consulte também o material de configuração MongoDB disponibilizado pela disciplina: [guia no Moodle da UTFPR](https://moodle.utfpr.edu.br/mod/book/view.php?id=2172296).

## Instalação e configuração

Na raiz do repositório, crie o arquivo local `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Edite o `.env` e configure os valores:

```env
PORT_SERVER=8080
MONGO_URL_ATLAS=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority
```

O arquivo `.env` contém credenciais e não deve ser enviado ao Git.

### Instalar dependências para execução local

```bash
cd app
npm install
```

## Executar o projeto

### Com Docker Compose

Com o `.env` configurado e o Docker Desktop em execução, volte à raiz do repositório e execute:

```bash
docker compose up --build
```

A aplicação estará disponível em `http://localhost:8080` (ou na porta definida em `PORT_SERVER`). Para encerrar:

```bash
docker compose down
```

### Localmente, sem Docker

No terminal, entre na pasta `app`, configure `MONGO_URL_ATLAS` e `PORT_SERVER` no ambiente e inicie a aplicação:

```bash
cd app
npm install
npm start
```

No Linux ou macOS, as variáveis podem ser definidas antes de iniciar:

```bash
export PORT_SERVER=8080
export MONGO_URL_ATLAS='mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority'
npm start
```

No PowerShell:

```powershell
$env:PORT_SERVER = "8080"
$env:MONGO_URL_ATLAS = "mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority"
npm start
```

Como o comando local não carrega o `.env` automaticamente, configure as variáveis no ambiente antes de executar `npm start`.

## Páginas e endpoints

| Método | Caminho | Descrição |
| --- | --- | --- |
| GET | `/cadastroUsuario` | Formulário para cadastro de usuário |
| POST | `/cadastroUsuario` | Cadastra usuário recebendo JSON |
| GET | `/criarPostagem` | Formulário para criar postagem |
| POST | `/criarPostagem` | Cria postagem associada ao e-mail de um usuário |
| GET | `/visualizarPostagens` | Lista e busca postagens |
| GET | `/visualizarPostagem/:id` | Página de detalhes da postagem e comentários |
| GET | `/postagens?q=termo` | Lista postagens; `q` filtra título e conteúdo |
| GET | `/postagens/:id` | Consulta uma postagem |
| PATCH | `/postagens/:id` | Edita título e conteúdo |
| DELETE | `/postagens/:id` | Exclui postagem e comentários vinculados |
| GET | `/postagens/:id/comentarios` | Lista comentários da postagem |
| POST | `/postagens/:id/comentarios` | Cria comentário |
| PATCH | `/postagens/:id/comentarios/:comentarioId` | Edita comentário |
| DELETE | `/postagens/:id/comentarios/:comentarioId` | Exclui comentário |

## Estrutura do projeto

```text
.
├── app/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── log/
│   │   └── errors.log
│   ├── models/
│   ├── public/
│   ├── utils/
│   ├── app.js
│   ├── package.json
│   └── server.js
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

As exceções da aplicação são registradas em `app/log/errors.log`, incluindo data e hora, operação, tipo, mensagem e stack trace quando disponível.
