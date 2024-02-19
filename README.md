# About
The goal of this project is to build a rudimentary testing suite to automate tasks normally performed on TestPad by QA Engineers at MPC. 


# Setup
- Install Cypress v13.6.4
- Clone this repo
- Create .env file with the following contents:
```
BASE_URL=http://example_domain.mobilepricecards.com
USER_EMAIL=example_email@mobilepricecard.com
USER_PASSWORD=example_password
```


# Usage
- After setup, run `npx cypress open`

If you need help troubleshooting or have questions please reach out to Finn Jacobs or Anneika Weeks


# Notes
- With `testIsolation` set to false in `cypress.config.js`, clearing cache and refreshing browser is necessary between test runs.