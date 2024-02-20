const { defineConfig } = require("cypress");
const sqlite3 = require('sqlite3');
const fs = require('fs')


module.exports = defineConfig({
  projectId: 's2ekj4',
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        queryDb: (query) => {
          return queryTestDb(query)
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
        user: "'xJEv0TRBpLZ4C2yP7LlL'@'bch7uqeda4jykbc5p2bq-mysql.services.clever-cloud.com'",
        password: "xJEv0TRBpLZ4C2yP7LlL",
        database: "bch7uqeda4jykbc5p2bq"
      }
    }
  },
  isTextTerminal: false,
  numTestsKeptInMemory: 50,
});

function queryTestDb(query) {
  let path = "database/motor.db"
  let db = new sqlite3.Database(path);
  return new Promise((resolve, reject) => {
    console.log(`sql -> ${query}`)
      db.all(query, [], (err, rows) => {
      if(err) 
          reject(err); 
      else  {
        db.close();
        return resolve(rows);
      }//End else
    });//End db.run
  });
}