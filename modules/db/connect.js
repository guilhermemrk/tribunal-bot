const sqlite3 = require('sqlite3').verbose();

const ConnectDB = (config) => {
    db = new sqlite3.Database(config.dbpath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Connected to DB!`)
  });
}

module.exports = { ConnectDB }
