describe('test', () => {
    it('should create a new store with add button', () => {
        cy.interceptApiCall('POST', 'Store/addStore');
        cy.login();
        cy.getPage('Store');

        cy.fixture('super-admin-v8').then((data) => {
            // Select Org
            cy.handleDropdown('#ouSelect', data.ou.name, 2);

            // Add Store
            const store = data.stores[0];
            cy.addStore(store.name, store.code, store.lang, store.password);
        });

        // Assert
        cy.wait('@addStore').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});
