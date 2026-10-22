const db_mongoose = require('./config/db_mongoose');
const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.PORT_SERVER || 3000;

mongoose.connect(db_mongoose.connection)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor iniciado na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exitCode = 1;
  });

  