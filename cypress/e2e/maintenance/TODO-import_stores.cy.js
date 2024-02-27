describe('test', () => {
    it('should work', () => {
        cy.login();
        cy.getPage('Store');

        // Select OU
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#ouSelect', data.ou.name, 2);
        });

        // Open import store modal
        cy.contains('Re-Import Stores').click();

        // cy.get('label[for="reimportfile"]').selectFile('./assets/re-import_stores.xlsx');
    });
});
