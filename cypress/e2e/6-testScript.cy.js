describe('testing', () => {
    it('New layout available in create price card', () => {
        cy.loginAndNavigateToPage('Pricecard');
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click().click();

        // if the option exists in the menu, then the test has passed

        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('select#layout-select', data.term.layout);
        });
    });

    it('should check the new ar available in create product static', () => {
        cy.getPage('ProductStatic');
        cy.wait(500);
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click().click();

        // if the option exists in the menu, then the test has passed

        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('select#aspectRatiAddEditModalo', data.term.ar);
        });
        cy.get('button').contains('Cancel').click();
    });

    it('New mfg available in create product static', () => {
        cy.getPage('ProductStatic');
        cy.wait(500);
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click().click();

        // if the option exists in the menu, then the test has passed

        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('select#mfg', data.term.mfg);
        });
    });
});
