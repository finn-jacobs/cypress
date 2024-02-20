Cypress.Commands.add('login', () => {
    cy.visit(Cypress.env('BASE_URL')).wait(500);

    // Check if already logged in
    cy.location().then((loc) => {
        if (loc === null) {
            cy.origin('https://dev-w0f53seg.us.auth0.com', () => {
                cy.get('#email').type(Cypress.env('USER_EMAIL'));
                cy.get('#password').type(Cypress.env('USER_PASSWORD'));
                cy.get('#btn-login').click();
            });
        }
    });
});

Cypress.Commands.add('openNav', () => {
    cy.get('#nav-text-collapse > ul.navbar-nav.align-items-center.ml-md-auto > li.nav-item.d-xl-none', {timeout: 10000}).click();
});

Cypress.Commands.add('getPage', (pageName) => {
    cy.openNav();
    cy.get(`a[href="#/${pageName}"]`).click().wait(500);
});

Cypress.Commands.add('handleDropdown', (selector, value) => {
    cy.get(selector).then($select => {
        const $options = $select.find(`option`).filter((i, el) => {
            return el.textContent === value;
        });
        if ($options.length > 0) {
            const valueOfFirstMatch = $options.first().val();
            cy.wrap($select).select(valueOfFirstMatch).should('have.value', valueOfFirstMatch);
        } else {
            cy.log(`No option found matching ${value}`);
        }
    });
})

Cypress.Commands.add('createOU', (name, carrier, pricePlan, isChild = false) => {
    // Open OU modal
    cy.get('div.btn-wraper-cstm > div:nth-child(1) > div > button').click().click();
            
    // Set as sibling or child
    if (isChild === false) {
        cy.contains('label', 'Sibling').click();
    }

    // Fill out name
    cy.get('input#name').type(name);

    // Select Carrier
    cy.get('#cariers-group-1 > div > div').click().wait(100);
    cy.get('.vs__dropdown-menu > li').contains(carrier).first().click();
    cy.get('#modal-add___BV_modal_title_').click();

    // Select Price Plan
    cy.handleDropdown('select#pricingPlanID', pricePlan);

    // Submit and close modal
    cy.get('#modal-add___BV_modal_footer_ > button.btn.btn-primary').click();
});