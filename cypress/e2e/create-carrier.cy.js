describe('Create a Carrier', () => {
    it('should successfully add a new carrier', () => {
        // Login to Phoenix
        cy.login();
    
        // Open navbar
        cy.openNav();

        // Navigate to carrier
        cy.get('.navbar-inner > ul > li > div > ul > a:nth-child(1)').click();

        // Open add carrier modal
        cy.get('div.card-header > div > div.col-md-4 > div > button').click().click();

        // Fill form and submit
        cy.fixture('create-carrier').then(data => {
            cy.get('#term-group-1 > div > #value').type(data['carrierTitle']);
            cy.get('#value-group-1 > div > #value').type(data['carrierDescription']);
        })
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
    })

    

    
});