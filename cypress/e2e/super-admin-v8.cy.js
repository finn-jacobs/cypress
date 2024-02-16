describe('Super Admin v8', () => {
    
    beforeEach(() => {
        cy.clearLocalStorage();
    })

    it("should add a new carrier", () => {
        // Login to Phoenix
        cy.login();
    
        // Open navbar
        cy.openNav();

        // Navigate to carrier
        cy.get('.navbar-inner > ul > li > div > ul > a:nth-child(1)').click().wait(500);

        // Open add carrier modal
        cy.get('div.card-header > div > div.col-md-4 > div > button').click().click();

        // Fill form and submit
        cy.fixture('super-admin-v8').then(data => {
            cy.get('#term-group-1 > div > #value').type(data.carrier.name);
            cy.get('#value-group-1 > div > #value').type(data.carrier.description);
        })
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
    })

    it("should create a new price plan", () => { 
        // Open navbar
        cy.openNav();
      
        // Navigate to price plans
        cy.get('.navbar-inner > ul > li > div > ul > a:nth-child(5)').click().wait(500);

        // Open add price plan modal
        cy.get('.card-header.text-center > div > div:nth-child(3) > div > button').click().click();
        
        // Fill form and submit
        cy.fixture('super-admin-v8').then(data => {
            cy.get('#pricingPlanName').type(data.pricePlan.name);
            cy.get('#description').type(data.pricePlan.description);
            cy.get('select#idcarrier').select(data.carrier.name);
        })
        cy.get('#modal-add___BV_modal_footer_ > button.btn.btn-primary').click();
    })
});