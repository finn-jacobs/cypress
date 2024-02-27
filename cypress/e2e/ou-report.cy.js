describe('ou report download', () => {
  it('should download an OU Report and confirm the download was received', () => {
    cy.login();
    cy.interceptApiCall('GET', 'Dashboard/OULevelExport');

    // Trigger the download action (e.g., clicking a download button)
    cy.get(`a[href="${(Cypress.env('BASE_URL'))}Dashboard/OULevelExport"]`).click()
    
    // Assert 
    cy.wait('@OULevelExport').then(({response}) => {
      expect(response.statusCode).to.eq(200);
    });
  });
});
