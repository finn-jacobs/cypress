/**
 * Logs user into phoenix, if user is already logged in,
 * visits the home page
 * 
 * @param | None
 */
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


/**
 * Opens navbar
 * 
 * @param | None
 */
Cypress.Commands.add('openNav', () => {
    cy.get('#nav-text-collapse > ul.navbar-nav.align-items-center.ml-md-auto > li.nav-item.d-xl-none', {timeout: 10000}).click();
});


/**
 * Uses navbar to navigate to page with the passed route
 * 
 * @param route | String
 */
Cypress.Commands.add('getPage', (route) => {
    cy.openNav();
    cy.get(`a[href="#/${route}"]`).click().wait(500);
});


/**
 * Handles selecting value from select dropdown.
 * 
 * @param selector | String
 * @param value | String
 */
Cypress.Commands.add('handleDropdown', (selector, value) => {
    cy.get(selector).then($select => {
        const $options = $select.find(`option`).filter((i, el) => {
            const textContent = el.textContent.trim().replace(/\s+/g, ' ');
            return textContent === value;
        });
        console.log($options);
        if ($options.length > 0) {
            const valueOfFirstMatch = $options.first().val();
            cy.wrap($select).select(valueOfFirstMatch).should('have.value', valueOfFirstMatch);
        } else {
            cy.log(`No option found matching ${value}`);
        }
    });
});


/**
 * Creates an intercept to assert the response of an API call
 * 
 * @param method | String
 * @param endpoint | String
 * @param aliasName | String
 */
Cypress.Commands.add('interceptApiCall', (method, endpoint, aliasName) => {
    cy.intercept(method, `${Cypress.env('BASE_URL')}/${endpoint}`).as(aliasName);
});


/**
 * Adds an Organizational Unit on the OU page
 * 
 * @param name | String
 * @param carrier | String
 * @param pricePlan | String
 * @param usChild | Boolean
 */
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


/**
 * Adds/updates preferences for an OU
 * 
 * @param labelNumber | Int
 * @param title | String
 */
Cypress.Commands.add('setOUPreference', (labelNumber, title) => {
    const selector = `#name${labelNumber + 1}`;
    
    // Check if preference is not set
    cy.get(selector).invoke('attr', 'readonly').then((readonly) => {
        if (readonly) {
            // Web checkbox
            cy.get('div.cstm-form-wrap-oupreference')
                .children().eq(labelNumber)
                .children().eq(1)   
                .children().eq(0)   // Checkbox
                .children().eq(0)
                .children().eq(0).click();

            // Mobile checkbox
            cy.get('div.cstm-form-wrap-oupreference')
                .children().eq(labelNumber)
                .children().eq(1)   
                .children().eq(1)   // Checkbox
                .children().eq(0)
                .children().eq(0).click();
        }
    });

    // Label title
    cy.get(selector).clear().type(title);
});