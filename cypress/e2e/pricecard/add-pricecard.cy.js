describe('test', () => {
    it('should add a price card', () => {
        cy.login();
        cy.getPage('Pricecard');
    });
});
