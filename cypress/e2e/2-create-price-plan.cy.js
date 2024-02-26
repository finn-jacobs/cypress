describe('test', () => {
    it("should create a new price plan", () => {
        cy.interceptApiCall('POST', 'PricePlan/addPricingPlan');

        cy.login();

        // Navigate to Price Plans
        cy.getPage('Priceplan');

        // Open add price plan modal
        cy.get('.card-header.text-center > div > div:nth-child(3) > div > button').click().click();

        // Fill form and submit
        cy.fixture('super-admin-v8').then(data => {
            cy.get('#pricingPlanName').type(data.pricePlan.name);
            cy.get('#description').type(data.pricePlan.description);
            cy.handleDropdown('select#idcarrier', data.carrier.name);
        });
        cy.get('#modal-add___BV_modal_footer_ > button.btn.btn-primary').click();

        // Assert
        cy.wait('@addPricingPlan').then(({response}) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});