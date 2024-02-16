// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

/**
 * Intercepts uncaught exceptions to prevent Cypress from failing tests for specified non-critical errors.
 * Useful for ignoring known, benign errors that don't affect test outcomes.
 */
// Cypress.on('uncaught:exception', (err, runnable) => {
//     if (err.message.includes("Cannot read properties of undefined (reading 'length')")) {
//         cy.reload(true);
//         return false;
//     }
// })