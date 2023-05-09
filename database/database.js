const { MongoClient } = require("mongodb");
let _db;
// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "dbTwo";
function MongoConnected() {
  return client.connect().then((client) => {
    _db = client.db(dbName); //created a db
  });
  // .catch(() => {
  //   console.log("failed to connect");
  // });
  //returns a promise
}
function getDb() {
  if (_db) {
    return _db;
  }
  return null;
}
module.exports.MongoConnected = MongoConnected;
//mongodb server is stopped using services tab
module.exports.getDb = getDb;
