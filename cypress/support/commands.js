Cypress.Commands.add('disableCache', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('*', (req) => {
    req.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    req.headers['Pragma'] = 'no-cache';
    req.headers['Expires'] = '0';
  });
})

Cypress.Commands.add('login', () => {
    cy.visit(Cypress.env('BASE_URL'));
    cy.origin('https://dev-w0f53seg.us.auth0.com', () => {
      cy.get('#email').type(Cypress.env('USER_EMAIL'));
      cy.get('#password').type(Cypress.env('USER_PASSWORD'));
      cy.get('#btn-login').click();
    });
});

// Timoput of 10000ms to give time
Cypress.Commands.add('openNav', () => {
  cy.get('#nav-text-collapse > ul.navbar-nav.align-items-center.ml-md-auto > li.nav-item.d-xl-none', {timeout: 10000}).click();
})