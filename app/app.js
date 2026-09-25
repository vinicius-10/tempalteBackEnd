const db_mongoose = require('./config/db_mongoose');
const mongoose = require('mongoose');
const Exemplo = require('./models/Exemplo');

mongoose.connect(
  db_mongoose.connection,

).then(() => {
  console.log('conectado');
}).catch((err) => {
  console.log("eroo: " + err)
});

// --- CREATE ---
function insereExemplo() {
  new Exemplo({
    str: 'Teste',
    int: 10
  }).save().then(() => {
    console.log('Exemplo cadastrado');
  }).catch((err) => {
    console.log('erro: ' + err);
  });
}

// --- READ ---
async function consultaExemplo() {
  const exemplos = await Exemplo.find({
    str: 'Teste'
  });

  console.log(exemplos);
}
// --- UPDATE ---
async function atualizaExemplo() {
  const exemplos = await Exemplo.findOneAndUpdate(
    { str: 'Teste' },
    { int: 20 }
  );

  console.log(exemplos);
}

// --- DELETE ---
async function deletaExemplo() {
  const exemplos = await Exemplo.findOneAndDelete({
    str: 'Teste'
  });
}



 insereExemplo();
 consultaExemplo();
// atualizaExemplo();
// deletaExemplo();