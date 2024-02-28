describe('pricing testing', () => {
    it('should upload a file and a new product should be created', () => {
        cy.interceptApiCall('POST', 'ProductStatic/uploadProduct1');
        cy.interceptApiCall('GET', 'ProductStatic/showProductStaticDropDowns');
        cy.loginAndNavigateToPage('ProductStatic');

        // Open Upload Product modal
        cy.get('button.btn.base-button.mr-1.btn-upload.btn-outline-success').contains('Upload Product').click();

        // Upload file
        const filePath = 'cypress/assets/sample_product.xlsx';
        cy.get('label[for="importfile"]').selectFile(filePath);

        // Submit and assert
        cy.get('button.btn.btn-primary').click();
        cy.assertResponse('@uploadProduct1');
        cy.wait('@showProductStaticDropDowns');
    });

    it('should check that pricecard status indicator is RED', () => {
        cy.checkNewestProductStatus(false);
    });

    it('should create a new product', () => {
        cy.interceptApiCall('POST', 'ProductStatic/addProductStatic');
        cy.interceptApiCall('GET', 'ProductStatic/showProductStaticDropDowns');

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
        cy.assertResponse('@addProductStatic').wait(500);
        cy.wait('@showProductStaticDropDowns');
    });

    it('should check that pricecard status indicator is RED', () => {
        cy.checkNewestProductStatus(false);
    });

    it('should select new product and add a default product fluid', () => {
        cy.interceptApiCall('POST', 'ProductFluid/addProductFluid1*');
        cy.interceptApiCall('GET', 'ProductFluid/showPage*');

        // Select most recently added product
        cy.getLastProductPage();
        cy.get('tbody').children().last().find('td[aria-colindex="1"]').click();
        cy.wait('@showPage*');

        // Add price fluid
        cy.fixture('super-admin-v8').then((data) => {
            const pricing = data.product.pricing[0];
            cy.addProductFluid(data.pricePlan.name, pricing, true);
        });

        // Assert
        cy.assertResponse('@addProductFluid1*');
    });

    it('should add a second product fluid to that product', () => {
        cy.interceptApiCall('POST', 'ProductFluid/addProductFluid1*');

        // Add price fluid
        cy.fixture('super-admin-v8').then((data) => {
            const pricing = data.product.pricing[1];
            cy.addProductFluid(data.pricePlan.name, pricing, false);
        });

        // Assert
        cy.assertResponse('@addProductFluid1*');
    });

    it('should download all pricing', () => {
        cy.getPage('ProductStatic');
        cy.interceptApiCall('GET', 'Analytics/genratePriceList');

        // Trigger the download action
        cy.get(`a[href*="Analytics/genratePriceList"]`).click();

        // Assert
        cy.wait('@genratePriceList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
