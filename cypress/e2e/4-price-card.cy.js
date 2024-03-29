describe('test', () => {
    it('should add a price card', () => {
        cy.interceptApiCall('POST', 'PriceCard/addPriceCard');
        cy.loginAndNavigateToPage('Pricecard');
        const filePath = 'cypress/assets/tmoPixel7a.zip';

        // Open add price card modal
        cy.contains('Add').click().click();

        // Fill form
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#idcarrier', data.carrier.name);
            cy.handleDropdown('#idproduct', data.product.name, 2);
            cy.get('#priceCardName').type(data.priceCard.name);
            cy.get('#longDescription').type(data.priceCard.description);
            cy.handleDropdown('#aspectRatio', data.product.ar);
            cy.get('#fileName').selectFile(filePath, { force: true });
            cy.handleDropdown('#os-select', data.product.os);
            cy.handleDropdown('#layout-select', data.priceCard.layout);
            cy.handleDropdown('#term-group-1 > div > select', data.priceCard.orientation);
        });

        // Submit and assert
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
        cy.assertResponse('@addPriceCard');
    });

    it('should verify product now has GREEN status for pricecard', () => {
        cy.interceptApiCall('GET', 'ProductStatic/showPage*');
        cy.getPage('ProductStatic');
        cy.wait('@showPage*');
        cy.checkNewestProductStatus(true);
    });
});
