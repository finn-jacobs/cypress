describe('terms', () => {
    it('should add a new ar term', () => {
        cy.interceptApiCall('POST', 'Terms/addTerm');
        cy.loginAndNavigateToPage('terms');

        // open and fill out modal
        cy.get('button.btn.base-button.btn-outline-default').contains('Add').click().click();

        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#term', 'ar');
            cy.get('input#value').type(data.term.ar);
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

        // open and fill out modal
        cy.get('button.btn.base-button.btn-outline-default').click().click();
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#term', 'mfg');
            cy.get('input#value').type(data.term.mfg);
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

        // open and fill out modal
        cy.get('button.btn.base-button.btn-outline-default').click().click();
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#term', 'layout');
            cy.get('input#value').type(data.term.layout);
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
