describe('ou report download', () => {
    it('should download an OU Report and confirm the download was received', () => {
        cy.login();

        cy.intercept('GET', `${Cypress.env('BASE_URL')}/Dashboard/OULevelExport`).as('downloadRequest');

      // Trigger the download action (e.g., clicking a download button)
      cy.get(`a[href="${(Cypress.env('BASE_URL'))}Dashboard/OULevelExport"]`).click()
      
      // Wait for the download request to complete
      cy.wait('@downloadRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });

        // Wait for the download request to complete
        cy.wait('@downloadRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
        });
    });
});
