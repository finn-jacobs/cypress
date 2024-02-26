describe('test', () => {
    it('should upload stores', () => {
        cy.interceptApiCall('POST', 'Store/importStore');
        cy.login();
        cy.getPage('Store');

        // Select OU
        cy.fixture('super-admin-v8').then(data => {
            cy.handleDropdown('#ouSelect', data.ou.name, 2);
        });

        // Open upload store modal
        cy.get('div.card-header.text-center > div:nth-child(1) > div:nth-child(1) > div').click();
        
        // Add file to upload
        cy.get('label[for="importfile"]').selectFile('./assets/upload_stores.xlsx');

        // Submit and assert
        cy.get('#modal-import___BV_modal_footer_ > button.btn.btn-primary').click();
        cy.wait('@importStore').then(({response}) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});