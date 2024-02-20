const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 's2ekj4',
  e2e: {
    setupNodeEvents(on, config) {

      const bmw = require('./res/json/bmw.json')

      config.env.bmw = bmw

      return config
    },
  },
  isTextTerminal: false,
  numTestsKeptInMemory: 50,
});

