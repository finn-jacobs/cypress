describe('test', () => {
    it("should add a new carrier", () => {
        cy.interceptApiCall('POST', 'Carriers/add');
        
        // Login to Phoenix
        cy.login();
    
        // Navigate to Carrier
        cy.getPage('carrier');

        // Open add carrier modal
        cy.get('div.card-header > div > div.col-md-4 > div > button').click().click();

        // Fill form and submit
        cy.fixture('super-admin-v8').then(data => {
            cy.get('#term-group-1 > div > #value').type(data.carrier.name);
            cy.get('#value-group-1 > div > #value').type(data.carrier.description);
        });
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();

        // Assert
        cy.wait('@add').then(({response}) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});