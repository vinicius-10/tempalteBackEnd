const db_mongoose = require('./config/db_mongoose');
const mongoose = require('mongoose');
const Campus = require('./models/campus');

mongoose.connect(
  db_mongoose.connection,

).then(() => {
  console.log('conectado');
}).catch((err) => {
  console.log("eroo: " + err)
});


function insereCampus() {
  new Campus({
    nome: 'Dois Vizinhos',
    universidade: 'UTFPR',
    endereco: 'estrada para ...',
    qtdAlunos: 1500
  }).save().then(() => {
    console.log('Campus cadastrado');
  }).catch((err) => {
    console.log('erro');
  });
}

//insereCampus();

async function consultaCampus() {
  const campi = await Campus.find({
    universidade: 'UTFPR'
  });

  console.log(campi);
}

//consultaCampus();

async function atualizaCampus() {
  const campi = await Campus.findOneAndUpdate(
    { universidade: 'UTFPR' },
    { universidade: 'UTFPR-DV' }
  );

  console.log(campi);
}

// atualizaCampus();


async function deletaCampus() {
  const campi = await Campus.findOneAndDelete({
    universidade: 'UTFPR'
  });
}

// deletaCampus();