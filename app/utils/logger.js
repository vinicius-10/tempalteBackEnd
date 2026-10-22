const fs = require('node:fs');
const path = require('node:path');

const logDirectory = path.join(__dirname, '..', 'log');
const logFile = path.join(logDirectory, 'errors.log');

fs.mkdirSync(logDirectory, { recursive: true });
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, '');
}

function formatDate(date) {
  const pad = (value) => String(value).padStart(2, '0');

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function registrarErro(erro, operacao) {
  const tipo = erro instanceof Error ? erro.name : typeof erro;
  const mensagem = erro instanceof Error ? erro.message : String(erro);
  const stack = erro instanceof Error ? erro.stack : null;
  const registro = [
    `[${formatDate(new Date())}]`,
    `ERRO: ${operacao}`,
    `TIPO: ${tipo}`,
    `MENSAGEM: ${mensagem}`,
    ...(stack ? [`STACK: ${stack}`] : []),
    ''
  ].join('\n');

  try {
    fs.appendFileSync(logFile, `${registro}\n`, 'utf8');
  } catch (erroDeLog) {
    console.error('Não foi possível gravar no arquivo app/log/errors.log:', erroDeLog);
  }
}

module.exports = { registrarErro };
