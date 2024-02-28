describe('test', () => {
    it('should check if product status to be green', () => {
        cy.login();
        cy.getPage('ProductStatic');
        cy.fixture('super-admin-v8').then((data) => {
            cy.checkNewestProductStatus(false);
        });
    });
});
