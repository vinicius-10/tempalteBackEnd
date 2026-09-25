```markdown
# Template Backend - Node.js & MongoDB
> Template containerizado desenvolvido para auxiliar os alunos nas aulas de Programação Web Backend do curso de Engenharia de Computação da UTFPR-CP.

![Language](https://img.shields.io/badge/Linguagem-JavaScript-yellow)
![Node](https://img.shields.io/badge/Node.js-v20+-green)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Container](https://img.shields.io/badge/Docker-Enabled-blue)
![Tipo](https://img.shields.io/badge/Tipo-Acadêmico-blue)

<br>

## Programação Web Backend - Engenharia de Computação - UTFPR-CP

### Criador
| Alunos |
|:--------|
| [Vinícius Souza Dias](https://github.com/vinicius-10) |

<br>

## Sumário
| Seções do Guia |
|:--------|
| [Objetivo](#objetivo) |
| [Público-Alvo](#público-alvo) |
| [Estrutura do Projeto](#estrutura-do-projeto) |
| [Variáveis de Ambiente e Conexão](#variáveis-de-ambiente-e-conexão) |
| [Como Executar](#como-executar) |
| [Comandos Úteis do Docker](#comandos-úteis-do-docker) |

<br>

## Objetivo
Este repositório serve como um **template de inicialização rápida** para o desenvolvimento de aplicações backend em Node.js com banco de dados MongoDB utilizando Mongoose. O foco do projeto é abstrair a configuração do ambiente de desenvolvimento através do **Docker** e **Docker Compose**, garantindo que o código rode de forma padronizada para todos os estudantes.

## Público-Alvo
Alunos do curso de **Engenharia de Computação da UTFPR - Câmpus Cornélio Procópio (UTFPR-CP)** matriculados na disciplina de **Programação Web Backend**, além de estudantes que buscam uma estrutura inicial pronta para projetos Node.js containerizados.

<br>

## Estrutura do Projeto

A organização dos arquivos e pastas do template segue a arquitetura apresentada abaixo:

```text
tempalte/
├── app/
│   ├── config/
│   │   └── db_mongoose.js    # Configuração da conexão com o MongoDB via Mongoose
│   ├── models/
│   │   └── Exemplo.js        # Definição de Schema e Model do Mongoose (Exemplo)
│   ├── node_modules/         # Mapeado dinamicamente via volume do Docker
│   ├── app.js                # Arquivo principal (Ponto de entrada do servidor HTTP)
│   ├── package-lock.json     # Trava de versões das dependências
│   └── package.json          # Configuração do projeto Node e scripts
├── .env                      # Variáveis de ambiente locais (não enviado ao Git)
├── .env.example              # Modelo de variáveis de ambiente para referência
├── .gitignore                # Regras de arquivos ignorados no versionamento
├── docker-compose.yml        # Configuração dos serviços Docker (Node e MongoDB)
├── Dockerfile                # Receita de build da imagem da aplicação Node
└── README.md                 # Documentação do projeto

```

### Descrição dos Arquivos Principais

* **`app/app.js`**: Contém a inicialização do servidor HTTP e a chamada de conexão com o banco de dados.
* **`app/config/db_mongoose.js`**: Módulo responsável por obter a URL de conexão e conectar o Mongoose ao banco.
* **`app/models/Exemplo.js`**: Exemplo prático de criação de Schema do Mongoose para manipulação de coleções no MongoDB.
* **`docker-compose.yml`**: Orquestra os containers da aplicação, configurando portas, volumes e injeção do arquivo `.env`.
* **`Dockerfile`**: Define a imagem base do Node.js, diretório de trabalho (`/usr/src/app`) e o comando de inicialização com modo de recarregamento automático (`node --watch`).

## Variáveis de Ambiente e Conexão

O projeto suporta dois tipos de ambientes para o MongoDB: **Local (Docker)** e **Atlas (Nuvem)**.


### 1. Comparativo de Conexão

| Característica | Conexão Local (`DB_URL`) | Conexão Atlas (`MONGO_URL_ATLAS`) |
| --- | --- | --- |
| **Hospedagem** | Container `db` no seu computador. | Nuvem (MongoDB Atlas). |
| **Acesso à Internet** | **Não requer internet** (funciona offline). | **Exige internet ativa**. |
| **Uso Ideal** | Aulas práticas, desenvolvimento sem internet ou testes rápidos. | Compartilhamento de banco com a equipe e entrega final de trabalhos. |

## Como Executar

### Pré-requisitos

* [Docker Desktop](https://www.docker.com/?utm_source=gemini) instalado e rodando na máquina.
* Git para clonar o repositório.

### Passo a Passo

1. **Clonar o repositório:**
```bash
git clone [https://github.com/vinicius-10/template-backend.git](https://github.com/vinicius-10/template-backend.git)
cd template-backend

```


2. **Configurar as Variáveis de Ambiente:**
Crie o arquivo `.env` na raiz copiando do modelo `.env.example`:
```bash
cp .env.example .env
```


3.  **Configuração do `.env`:**
Edite o `.env` na raiz do projeto com seus dados:

```env
# Server
PORT_SERVER=8080

# Database (MongoDB Cloud Atlas)
MONGO_URL_ATLAS=mongodb+srv://usuario:<password>@cluster.mongodb.net/backend?retryWrites=true&w=majority

# Database (MongoDB Local no Docker)
DB_URL=mongodb://db:27017/backend

```

4. **Alternando entre Conexão Local e Atlas:**

No arquivo `app/config/db_mongoose.js`, altere qual variável será utilizada comentando/descomentando a linha correspondente:

```javascript
// const DB_URL = process.env.MONGO_URL_ATLAS // Conexão pelo Atlas (Nuvem)
const DB_URL = process.env.DB_URL // Conexão local (Docker)

const StringCon = {
  connection: DB_URL
};

module.exports = StringCon;

```


5. **Subir os Containers no Docker:**
```bash
docker compose up

```


*(A aplicação estará acessível em `http://localhost:8080`)*

## Comandos Úteis do Docker

* **Instalar novas dependências no Node.js via container:**
```bash
docker compose exec app npm install <nome-do-pacote>

```


* **Acessar o terminal interativo do MongoDB (`mongosh`):**
```bash
docker compose exec db mongosh

```


* **Visualizar apenas os logs do servidor Node:**
```bash
docker compose logs -f app

```


* **Parar os containers:**
```bash
docker compose down

```

