describe('pricing testing', () => {
    it('should create a new product', () => {
        cy.interceptApiCall('POST', 'ProductStatic/addProductStatic');

        cy.login();
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
        cy.assertResponse('@addProductStatic');
    });

    it('should upload a file and a new product should be created', () => {
        cy.interceptApiCall('POST', 'ProductStatic/uploadProduct1');

        // Open Upload Product modal
        cy.get('button.btn.base-button.mr-1.btn-upload.btn-outline-success').contains('Upload Product').click();

        // Upload file
        const filePath = 'cypress/assets/sample_product.xlsx';
        cy.get('label[for="importfile"]').selectFile(filePath);

        // Submit and assert
        cy.get('button.btn.btn-primary').click();
        cy.assertResponse('@uploadProduct1');
    });

    it('should check that both new products have red dots on the price card column', () => {
        // Check the last products on the last page
        cy.get('button[aria-label="Go to last page"]')
            .should('be.visible')
            .click()
            .then(() => {
                // Select the last two elements
                // check their CSS properties
                cy.get('i.fas.fa-circle').then(($elements) => {
                    const lastTwoElements = $elements.slice(-2);
                    cy.wrap(lastTwoElements).should('have.css', 'color', 'rgb(255, 0, 0)');
                });
            });
    });

    it('should select one of the new products and create a default price fluid on it', () => {
        cy.interceptApiCall('POST', 'ProductFluid/addProductFluid1*');

        cy.get('td[aria-colindex="2"][role="cell"]').contains('Cypress Carrier').click();
        cy.wait(1000);
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click();

        // Choose start and end dates
        cy.handleDatePicker('label#example-datepicker__value_', '#timeExpires__value_');

        // Fill out form
        cy.fixture('super-admin-v8').then((data) => {
            const pricing = data.product.pricing[0];
            cy.handleDropdown('select#pricingPlanID', data.pricePlan.name);
            cy.get('#planpricename').type(pricing.name);
            cy.get('label[for="isDefault"]').click();

            pricing.priceFluids.forEach((priceFluid, index) => {
                cy.get(`#planAprice${index}`).type(priceFluid);
            });
            cy.get('button.btn.btn-primary').contains('Ok').click();
        });

        // Assert
        cy.assertResponse('@addProductFluid1*');
    });

    it('should add a second product fluid to that product', () => {
        cy.interceptApiCall('POST', 'ProductFluid/addProductFluid1*');
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click();

        // Choose start and end dates
        cy.handleDatePicker('label#example-datepicker__value_', '#timeExpires__value_');

        // Fill out form
        cy.fixture('super-admin-v8').then((data) => {
            const pricing = data.product.pricing[1];
            cy.handleDropdown('select#pricingPlanID', data.pricePlan.name);
            cy.get('#planpricename').type(pricing.name);
            cy.get('label[for="isDefault"]').click();

            pricing.priceFluids.forEach((priceFluid, index) => {
                cy.get(`#planAprice${index}`).type(priceFluid);
            });
            cy.get('button.btn.btn-primary').contains('Ok').click();
        });

        // Assert
        cy.assertResponse('@addProductFluid1*');
    });

    it('should download all pricing', () => {
        // Login and Navigate to Pricing
        cy.login();
        cy.getPage('ProductStatic');

        cy.interceptApiCall('GET', 'Analytics/genratePriceList');

        // Trigger the download action
        cy.get(`a[href="${Cypress.env('BASE_URL')}Analytics/genratePriceList"]`).click();

        // Assert
        cy.wait('@genratePriceList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
