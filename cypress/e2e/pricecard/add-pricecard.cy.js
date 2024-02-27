describe('test', () => {
    it('should add a price card', () => {
        cy.interceptApiCall('POST', 'PriceCard/addPriceCard');
        cy.login();
        cy.getPage('Pricecard');

        // Open add price card modal
        cy.contains('Add').click().click();

        // Fill form
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#idcarrier', data.carrier.name);
            cy.handleDropdown('#idproduct', data.product.name);
            cy.get('#priceCardName').type(data.priceCard.name);
            cy.get('#longDescription').type(data.priceCard.description);
            cy.handleDropdown('#aspectRatio', data.product.ar);
            cy.get('#fileName').selectFile('./assets/tmoPixel7a.zip', { force: true });
            cy.handleDropdown('#os-select', data.product.os);
            cy.handleDropdown('#layout-select', data.priceCard.layout);
            cy.handleDropdown('#term-group-1 > div > select', data.priceCard.orientation);
        });

        // Submit and assert
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
        cy.assertResponse('@addPriceCard');
    });
});
