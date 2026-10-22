const db_mongoose = require('./config/db_mongoose');
const mongoose = require('mongoose');
const app = require('./server');
const logger = require('./utils/logger');

const PORT = process.env.PORT_SERVER || 3000;

mongoose.connect(db_mongoose.connection)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor iniciado na porta ${PORT}`);
    });
  })
  .catch((err) => {
    logger.registrarErro(err, 'Conectar ao MongoDB');
    process.exitCode = 1;
  });

  