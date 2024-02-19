const { defineConfig } = require("cypress");
const mysql = require('mysql');
const fs = require('fs')


module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        queryDb: (query) => {
          return queryTestDb(query, config)
        },

        readFileMaybe: (filename) => {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8')
          }
          return null
        },
      })
    },
    "env": {
      "db": {
        "server": '127.0.0.1',
        user: "sa",
        password: "1234",
        database: "motor"
      }
    }
  },
  isTextTerminal: false,
  numTestsKeptInMemory: 50,
});

function queryTestDb(query, config) {
  const connection = mysql.createConnection(config.env.db);
  connection.connect();

  return new Promise((resolve, reject) => {
    connection.query(query, (error, result) => {
      if (error) reject(error);
      else {
        connection.end();
        return resolve(result);
      }
    })
  })
}