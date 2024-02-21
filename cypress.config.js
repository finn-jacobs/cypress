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
      SIGN_IN_EMAIL: process.env.SIGN_IN_EMAIL,
      SIGN_IN_PASSWORD: process.env.SIGN_IN_PASSWORD,
      NEW_USER_EMAIL: process.env.NEW_USER_EMAIL
    }
  },
});
