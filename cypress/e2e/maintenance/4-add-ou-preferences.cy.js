describe('test', () => {
    it('should add preferences to OUs', () => {
        cy.intercept(
            'POST',
            new RegExp(
                `${Cypress.env('BASE_URL')}/OrgPreferences/(addOUPreference|updateOUPreference)$`
            )
        ).as('manageOUPreference');

        cy.login();
        cy.getPage('organization');

        // Select first OU
        cy.get('ul.tree-menu').as('orgList');
        cy.get('@orgList').children().eq(1).click();

        // Open preferences
        cy.get('ul.nav.nav-tabs').contains('Preferences').click();

        // Set preferences
        cy.fixture('super-admin-v8').then((data) => {
            data.ou.preferences.forEach((preference, index) => {
                cy.setOUPreference(index, preference.title);
            });
        });

        // Submit
        cy.get('.tab-content > .active > .btn-wraper > button').click();
        cy.wait('@manageOUPreference').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });

        // select second OU
        cy.get('@orgList').children().eq(2).click();

        // Open preferences
        cy.get('ul.nav.nav-tabs').contains('Preferences').click();

        // Set preferences
        cy.fixture('super-admin-v8').then((data) => {
            data.ou.preferences.forEach((preference, index) => {
                cy.setOUPreference(index, preference.title);
            });
        });

        // Submit
        cy.get('.tab-content > .active > .btn-wraper > button').click();
        cy.wait('@manageOUPreference').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});
