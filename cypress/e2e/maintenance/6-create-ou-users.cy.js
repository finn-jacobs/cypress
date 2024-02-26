describe('test', () => {
    it('should create a user under Cypress Org', () => {
        cy.interceptApiCall('POST', 'Users/addUser');
        cy.login();
        cy.getPage('userlist');

        // Open add user modal
        cy.get('div.card-header.text-center > div > div.col-md-5.center-content.align-right > div > button').click();
        
        // Add timestamp to email for new user
        const email = generateUniqueEmail(Cypress.env('NEW_USER_EMAIL'));

        // Fill form
        cy.fixture('super-admin-v8').then(data => {
            cy.get('#DBA2').type(data.ou.user.name);
            cy.handleDropdown('#ouSelect', data.ou.name);
            cy.get('#name2').type(email);
            cy.get('#DBA1').type(data.ou.user.phone);
            cy.get('#name').type(data.ou.user.password);
            cy.get('#DBA3').type(data.ou.user.password);
            cy.handleDropdown('#modal-add___BV_modal_body_ > div:nth-child(8) > div > select', data.ou.user.group);
        });

        // Submit and assert
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
        cy.wait('@addUser').then(({response}) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            expect(body.error).to.eq(false);
        });
    });
});

function generateUniqueEmail(email) {
    const dateTime = new Date().toISOString()
        .replace(/\.\d+Z$/, '')
        .replace(/T/, '-') 
        .replace(/:/g, '-');
    const [address, domain] = email.split('@');
    return `${address}+${dateTime}@${domain}`;
}