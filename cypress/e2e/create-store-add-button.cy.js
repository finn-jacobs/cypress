describe('test', () => {
    it('should create a new store with add button', () => {
        cy.interceptApiCall('POST', 'Store/addStore', 'addStore');
        
        cy.login();
        cy.getPage('Store');

        cy.fixture('super-admin-v8').then(data => {
            cy.handleDropdown('#ouSelect', data.ou.name);
            cy.get('div.card-header.text-center > div:nth-child(4) > div.col-md-1 > div > button').click().click();
            cy.get('#storeName').type(data.store.name);
            cy.get('#storeCode').type(data.store.code);
            cy.get('#storeLang').type(data.store.lang);
            
            // Calculate UTC offset, open, and closing hours
            const today = new Date();
            const offset = 0 - (today.getTimezoneOffset() / 60);
            let open = (today.getUTCHours() + offset + 2) % 24;
            let closed = (today.getUTCHours() + offset + 1) % 24;
            
            cy.get('#open-group-1 > div > #open').select(open);
            cy.get('#closed').select(closed);
            cy.get('#UTCOffset').type(offset);
            cy.get('#password').type(data.store.password);
        });

        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
        cy.wait('@addStore').then(({response}) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});
