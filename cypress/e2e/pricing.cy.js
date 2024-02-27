describe('pricing testing', () => {
    it('should create a new product', () => {
        cy.interceptApiCall('POST', 'ProductStatic/addProductStatic');
        cy.login();

        // Navigate to Product Static
        cy.getPage('ProductStatic');

        // Press the 'Add' Button
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click().click();

        // Open 'Add Product' Modal and fill out all fields
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#idcarrier', data.carrier.name);
            cy.handleDropdown('#aspectRatiAddEditModalo', data.product.ar);
            cy.handleDropdown('#mfg.custom-select.custom-select-sm', data.product.mfg);
            cy.get('#productName').type(data.product.name);
            cy.get('#mdescLong').type(data.product.meta);
            cy.get('#sku').type(data.product.sku);
        });

        // Submit and assert
        cy.get('button.btn.btn-primary').click();
        cy.wait('@addProductStatic').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });

    it('should upload a file and a new product should be created', () => {
        cy.interceptApiCall('POST', 'ProductStatic/uploadProduct1');
        cy.login();

        // Navigate to Product Static
        cy.getPage('ProductStatic');

        // Open Upload Product modal
        cy.get('button.btn.base-button.mr-1.btn-upload.btn-outline-success').contains('Upload Product').click();

        // Upload file
        const filePath = './assets/sample_product.xlsx';
        cy.get('label[for="importfile"]').selectFile(filePath);

        // Submit and assert
        cy.get('button.btn.btn-primary').click();
        cy.wait('@uploadProduct1').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });

    it('should check that both new products have red dots on the price card column', () => {
        // Login to Phoenix
        cy.login();

        // Navigate to Pricing Page
        cy.getPage('ProductStatic');

        // Select the last two elements
        // check their CSS properties
        cy.get('i.fas.fa-circle').then(($elements) => {
            const lastTwoElements = $elements.slice(-2);
            cy.wrap(lastTwoElements).should('have.css', 'color', 'rgb(255, 0, 0)');
        });
    });

    /**
     *
     * TODO: current method for setting date pickers does not work
     *
     */
    it('should select one of the new products and create a default price fluid on it', () => {
        cy.login();
        cy.getPage('ProductStatic');

        cy.get('td[aria-colindex="2"][role="cell"]').contains('Cypress Carrier').click();
        cy.wait(1000);
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click();

        cy.handleDatePicker('label#example-datepicker__value_', '#timeExpires__value_');

        // Fill form
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#pricingPlanID', data.pricePlan.name);
            cy.get('#planpricename').type(data.product.pricing.name);
            cy.get('label[for="isDefault"]').click();

            data.product.pricing.priceFluids.forEach((priceFluid, index) => {
                cy.get(`#planAprice${index}`).type(priceFluid);
            });
        });
    });

    it('should download all pricing', () => {
        cy.login();

        // Navigate to
        cy.getPage('ProductStatic');

        cy.intercept('GET', `${Cypress.env('BASE_URL')}/Analytics/genratePriceList`).as('downloadRequest');

        // Trigger the download action (e.g., clicking a download button)
        cy.get(`a[href="${Cypress.env('BASE_URL')}/Analytics/genratePriceList"]`).click();

        // Wait for the download request to complete
        cy.wait('@downloadRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200); // Check if the response status code is 200 (OK)

            // TODO Neka look back into this
            cy.log(interception.response);
        });
    });
});
