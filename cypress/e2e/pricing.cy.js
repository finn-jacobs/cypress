describe('pricing testing', () => {
  it('should create a new product', () => {
      // Login to Phoenix & navigate to Pricing Page
      cy.login(); 
      cy.getPage('ProductStatic');

      cy.get('button.btn.base-button.btn-outline-default')
        .contains('Add').click().click();

      // Fill out 'Add Product' Modal and submit 
      cy.fixture('pricing').then(data =>{
        cy.get('select#idcarrier.custom-select.custom-select-sm').select(data.productStatic.carrier);
        cy.get('select#aspectRatiAddEditModalo').select(data.productStatic.aspectRatio);
        cy.get('select#idcarrier.custom-select.custom-select-sm').select(data.productStatic.mfg);
        cy.get('input#productName.form-control').type(data.productStatic.productName);
        cy.get('input#mdescLong.form-control').type(data.productStatic.longDescription);
        cy.get('input#sku.form-control').type(data.productStatic.sku);
      })
      cy.get('button.btn.btn-primary').click();

      // confirm Product created pop up
      cy.on('window:alert', (message) => {
          expect(message).to.equal('Product Static added successfully');
        });
  });

  it('should upload a file and a new product should be created', () => {
    // Login to Phoenix & navigate to Pricing Page
      cy.login(); 
      cy.getPage('ProductStatic');
      cy.get('button.btn.base-button.mr-1.btn-upload.btn-outline-success')
          .contains('Upload Product').click();

      // find sample file and upload
      const filePath = 'cypress/assets/sample_product.xlsx';
      
      cy.get('label[for="importfile"]').selectFile(filePath);
      cy.get('button.btn.btn-primary').click();

      // confirmation message should pop up
      cy.on('window:alert', (message) => {
      expect(message).to.equal('1 product record(s) added successfully');
      });
  
  });

  it('should check that both new products have red dots on the price card column', () => {
      // Check the price card column for the last 2 products created
      // Those elements should be red
      cy.wait(1000);
      cy.get('i.fas.fa-circle').then($elements => {
          const lastTwoElements = $elements.slice(-2);
          cy.wrap(lastTwoElements).should('have.css', 'color', 'rgb(255, 0, 0)');
      });
  });

  it('should select one of the new products and create a default price fluid on it', () => {
      cy.get('td[aria-colindex="2"][role="cell"]').contains('Cypress Carrier').click();
      cy.wait(1000);
      cy.get('button.btn.base-button.btn-outline-default').contains('Add').click();

      const today = new Date();
      const twoDaysFromNow = new Date(today);
      twoDaysFromNow.setDate(today.getDate() + 2);

      // choose 2 dates - today and 2 days from today in calendars
      cy.get('label#example-datepicker__value_').then($label => {
        cy.wrap($label).click();
        const chosenDate = today.toISOString().split('T')[0];
        cy.get(`[data-date="${chosenDate}"]`).click();
      });

      cy.get('label#timeExpires__value_').then($label => {
        cy.wrap($label).click();
        const formattedDate = twoDaysFromNow.toISOString().split('T')[0];
        cy.get(`[data-date="${formattedDate}"]`).click();
      });

      // fill out the rest of the form then press save
      cy.get('select#pricingPlanID').select('Cypress Price Plan');
      cy.get('input#planpricename').type('Cypress Test');
      cy.get('label[for="isDefault"]').click();
      cy.get('input#planAprice0').type('120.00');
      cy.get('input#planAprice1').type('10.00');
      cy.get('input#planAprice2').type('12');
      cy.get('button.btn.btn-primary').click();
      
      // confirmation message should pop up
      cy.on('window:alert', (message) => {
        expect(message).to.equal('Product Fluid added successfully');
      });
  });

  it('should add a second product fluid to that product', () => {
    cy.get('button.btn.base-button.btn-outline-default').contains('Add').click();

    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    // choose 2 dates - today and 2 days from today in calendars
    cy.get('label#example-datepicker__value_').then($label => {
      cy.wrap($label).click();
      const chosenDate = today.toISOString().split('T')[0];
      cy.get(`[data-date="${chosenDate}"]`).click();
    });

    cy.get('label#timeExpires__value_').then($label => {
      cy.wrap($label).click();
      const formattedDate = twoDaysFromNow.toISOString().split('T')[0];
      cy.get(`[data-date="${formattedDate}"]`).click();
    });

    // fill out the rest of the form then press save
    cy.get('select#pricingPlanID').select('Cypress Price Plan');
    cy.get('input#planpricename').type('Cypress Test 2');
    cy.get('input#planAprice0').type('240.00');
    cy.get('input#planAprice1').type('20.00');
    cy.get('input#planAprice2').type('12');
    cy.get('button.btn.btn-primary').click();
    
    // confirmation message should pop up
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Product Fluid added successfully');
    });
});

  it('should download all pricing', () => {
    // login and navigate to pricing page
    cy.login();
    cy.getPage('ProductStatic');

    cy.intercept('GET', `${Cypress.env('BASE_URL')}/Analytics/genratePriceList`).as('downloadRequest');

    // Trigger the download action (e.g., clicking a download button)
    cy.get(`a[href="${(Cypress.env('BASE_URL'))}Analytics/genratePriceList"]`).click();
    
    // Wait for the download request to complete
    cy.wait('@downloadRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200); 
      // TODO Neka look back into this
      cy.log(interception.response)
      })
  });
})