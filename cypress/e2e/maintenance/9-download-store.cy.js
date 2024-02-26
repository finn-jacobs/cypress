describe('test', () => {
    it('should download stores from OU', () => {
        // Make sure intercept is using https
        const adjustedUrl = Cypress.env('BASE_URL').replace('http:', 'https:');
        cy.intercept('GET', `${adjustedUrl}/Store/export*`).as('export');
        cy.login();
        cy.getPage('Store');

        // Select OU
        cy.fixture('super-admin-v8').then(data => {
            cy.handleDropdown('#ouSelect', data.ou.name, 2).wait(500);
        });

        // Download and assert
        cy.contains('Download Stores').click();
        cy.wait('@export').then(({response}) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});