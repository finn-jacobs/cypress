Cypress.Commands.add('login', () => {
    cy.visit(Cypress.env('BASE_URL')).wait(500);

    // Check if already logged in
    cy.location().then((loc) => {
        if (loc === null) {
            cy.origin('https://dev-w0f53seg.us.auth0.com', () => {
                cy.get('#email').type(Cypress.env('USER_EMAIL'));
                cy.get('#password').type(Cypress.env('USER_PASSWORD'));
                cy.get('#btn-login').click();
            });
        }
    });
});

Cypress.Commands.add('openNav', () => {
    cy.get('#nav-text-collapse > ul.navbar-nav.align-items-center.ml-md-auto > li.nav-item.d-xl-none', {timeout: 10000}).click();
});

Cypress.Commands.add('getPage', (pageName) => {
    cy.openNav();
    cy.get(`a[href="#/${pageName}"]`).click().wait(500);
});