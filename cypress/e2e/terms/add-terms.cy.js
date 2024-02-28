describe('terms', () => {
    it('should add a new ar term', () => {
        cy.interceptApiCall('POST', 'Terms/addTerm');
        cy.loginAndNavigateToPage('terms');

        // open and fill out modal
        cy.get('button.btn.base-button.btn-outline-default').click().click();
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#term', data.term.aspectRatio);
            cy.get("input#value").type('20:20');
        });

        // submit and assert
        cy.get('button.btn-primary').click();
        cy.wait('@addTerm').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    }); 

    it('should add a new mfg term', () => {
        cy.interceptApiCall('POST', 'Terms/addTerm');
        cy.loginAndNavigateToPage('terms');

        // open and fill out modal
        cy.get('button.btn.base-button.btn-outline-default').click().click();
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#term', data.term.manufacturer);
            cy.get("input#value").type('Cypress Manufacturer');
        });

        // submit and assert
        cy.get('button.btn-primary').click();
        cy.wait('@addTerm').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    }); 

    it('should add a new layout term', () => {
        cy.interceptApiCall('POST', 'Terms/addTerm');
        cy.loginAndNavigateToPage('terms');

        // open and fill out modal
        cy.get('button.btn.base-button.btn-outline-default').click().click();
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#term', data.term.orientation);
            cy.get("input#value").type('Cypress Test Layout');
        });

        // submit and assert
        cy.get('button.btn-primary').click();
        cy.wait('@addTerm').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    }); 
});