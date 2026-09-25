//const DB_URL = process.env.MONGO_URL_ATLAS //conexão pelo atlas
const DB_URL = process.env.DB_URL // conexão local


console.log(DB_URL);
const StringCon = {
  connection: DB_URL
};

module.exports = StringCon;
