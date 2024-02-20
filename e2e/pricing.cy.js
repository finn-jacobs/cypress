describe('pricing testing', () => {
    // need this test in order to run the 'create new product test'
    it("should add a new carrier", () => {
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
    });
    
    
    it('should create a new product', () => {
        // Login to Phoenix
        cy.login();

        // Navigate to Pricing Page
        cy.getPage('ProductStatic');

        // Press the 'Add' Button
        cy.get('button.btn.base-button.btn-outline-default')
        .contains('Add')
        .click().click();

        // Open 'Add Product' Modal and fill out all fields
        // TODO refactor me to work correctly with the FIXTURE 
        cy.get('select#idcarrier.custom-select.custom-select-sm') 
            .select('Cypress Carrier');

        cy.get('select#aspectRatiAddEditModalo')
        .select('9:16');

        cy.get('select#mfg.custom-select.custom-select-sm')
        .select('Samsung');

        cy.get('input#productName.form-control')
        .type('SS 22');

        cy.get('input#mdescLong.form-control')
        .type('yellow tail');

        cy.get('input#sku.form-control')
        .type('123456');

        // close modal
        cy.get('button.btn.btn-primary').click()

        // look for Product created confirmation pop up
        cy.on('window:alert', (message) => {
            expect(message).to.equal('Product Static added successfully');
          });

          // <td aria-colindex="2" role="cell" class="">Cypress Carrier</td>
          
    });

    it('should download all pricing', () => {
      cy.login();

      // Navigate to Carrier
         cy.getPage('ProductStatic');

      cy.intercept('GET', `${Cypress.env('BASE_URL')}/Analytics/genratePriceList`).as('downloadRequest');

      // Trigger the download action (e.g., clicking a download button)
      cy.get(`a[href="${(Cypress.env('BASE_URL'))}/Analytics/genratePriceList"]`).click()
      
      // Wait for the download request to complete
      cy.wait('@downloadRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200); // Check if the response status code is 200 (OK)

        // TODO Neka look back into this
        cy.log(interception.response)

    });

    })
})