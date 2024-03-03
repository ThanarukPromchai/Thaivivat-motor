const { defineConfig } = require("cypress");
const fs = require('fs')

module.exports = defineConfig({
  projectId: 's2ekj4',
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        readFileMaybe: (filename) => {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8')
          }
          return null
        },
      })

      const runingNo = "1"
      const plan = require('./res/json/plan.json')
    
      config.env.plan = plan
      config.env.runNo = runingNo

      return config
    },
  },
  isTextTerminal: false,
  numTestsKeptInMemory: 500,
  experimentalMemoryManagement: true
});
