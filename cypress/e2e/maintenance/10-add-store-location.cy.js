describe('test', () => {
    it('should work', () => {
        cy.interceptApiCall('POST', 'Store/addStore');
        cy.interceptApiCall('POST', 'Store/addLocationToStore');
        cy.login();
        cy.getPage('Store');

        cy.fixture('super-admin-v8').then(data => {
            // Select Org
            cy.handleDropdown('#ouSelect', data.ou.name, 2);

            // Add Store
            const store = data.stores[1];
            cy.addStore(store.name, store.code, store.lang, store.password);

            // Assert
            cy.wait('@addStore').then(({response}) => {
                const body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(body.error).to.eq(false);
            });
            
            // Select new store and open location modal
            cy.contains(store.code).click();
            cy.get('tr.table-active > td[aria-colindex="9"]').children().eq(2).click();

            // Fill form
            cy.contains('label', 'Address Line 1').parent().find('input').type(store.location.address);
            cy.contains('label', 'City / Town').parent().find('input').type(store.location.city);
            cy.contains('label', 'Zip / Postal Code').parent().find('input').type(store.location.zip);
            cy.handleDropdown('#scountry', store.location.country);
            cy.handleDropdown('#sstate', store.location.state, 2);
        });

        // Submit and assert
        cy.get('#modal-add-location___BV_modal_footer_ > button.btn.btn-primary').click();
        cy.wait('@addLocationToStore').then(({response}) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});