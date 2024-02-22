// Import commands.js using ES2015 syntax:
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("Cannot read properties of null (reading 'style')")) {
        return false;
    }
});