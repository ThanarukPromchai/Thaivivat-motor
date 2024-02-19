const { defineConfig } = require("cypress");
const mysql = require('mysql');
const fs = require('fs')


module.exports = defineConfig({
  projectId: 's2ekj4',
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
        "server": 'bch7uqeda4jykbc5p2bq-mysql.services.clever-cloud.com',
        user: "u3vptwdyju71mj4m",
        password: "xJEv0TRBpLZ4C2yP7LlL",
        database: "bch7uqeda4jykbc5p2bq"
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