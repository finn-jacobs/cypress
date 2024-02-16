describe('Create Price Plan', () => {
    it('should successfully create a new price plan under "Cypress Carrier"', () => {
        // Login to Phoenix
        cy.login();
      
        // Open navbar
        cy.openNav();
      
        // Navigate to price plans
        cy.get('.navbar-inner > ul > li > div > ul > a:nth-child(5)').click();

        // Open add price plan modal
        cy.get('.card-header.text-center > div > div:nth-child(3) > div > button').click().click();
        
        // Fill form and submit
        cy.fixture('create-price-plan').then(data => {
            cy.get('#pricingPlanName').type(data['name']);
            cy.get('#description').type(data['description']);
            cy.get('select#idcarrier').select(data['carrier']);
        })
        cy.get('#modal-add___BV_modal_footer_ > button.btn.btn-primary').click();
    })
  });