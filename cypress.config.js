const { defineConfig } = require("cypress");
const dotenv = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    testIsolation: false,
    env: {
      BASE_URL: process.env.BASE_URL,
      USER_EMAIL: process.env.USER_EMAIL,
      USER_PASSWORD: process.env.USER_PASSWORD,
    }
  },
});
