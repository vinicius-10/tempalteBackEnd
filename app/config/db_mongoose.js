const DB_URL = process.env.MONGO_URL

console.log(DB_URL);
const StringCon = {
  connection: DB_URL
};

module.exports = StringCon;
