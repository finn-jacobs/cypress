/**
 * Logs user into phoenix, then navigates to
 * designated page
 *
 * @param route |  String
 */
Cypress.Commands.add('loginAndNavigateToPage', (route) => {
    cy.login();
    cy.getPage(route);
});

/**
 * Logs user into phoenix, if user is already logged in,
 * visits the home page
 *
 * @param | none
 */
Cypress.Commands.add('login', () => {
    cy.visit(Cypress.env('BASE_URL')).wait(500);

    // Check if already logged in
    cy.location().then((loc) => {
        if (loc === null) {
            cy.origin('https://dev-w0f53seg.us.auth0.com', () => {
                cy.get('#email').type(Cypress.env('SIGN_IN_EMAIL'));
                cy.get('#password').type(Cypress.env('SIGN_IN_PASSWORD'));
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
    cy.get('#nav-text-collapse > ul.navbar-nav.align-items-center.ml-md-auto > li.nav-item.d-xl-none', {
        timeout: 10000,
    }).click();
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
 * Waits for passed selector to have at least 'expectedCount' number of options.
 * Useful for when selector options take too long to load before cypress
 * interacts with the element
 *
 * @param selector | String
 * @param expectedCount | Number
 */
Cypress.Commands.add('waitForSelectOptions', (selector, expectedCount) => {
    cy.get(selector).should(($select) => {
        const count = $select.find('option').length;
        expect(count).to.be.at.least(expectedCount);
    });
});

/**
 * Handles selecting value from select dropdown.
 *
 * @param selector | String
 * @param value | String
 * @param expectedCount | Number
 */
Cypress.Commands.add('handleDropdown', (selector, value, expectedCount = null) => {
    if (expectedCount !== null) cy.waitForSelectOptions(selector, expectedCount);
    cy.get(selector).then(($select) => {
        const $options = $select.find(`option`).filter((i, el) => {
            const textContent = el.textContent.trim().replace(/\s+/g, ' ');
            return textContent === value;
        });
        if ($options.length > 0) {
            const valueOfFirstMatch = $options.first().val();
            cy.wrap($select).select(valueOfFirstMatch).should('have.value', valueOfFirstMatch);
        } else {
            cy.log(`No option found matching ${value}`);
        }
    });
});

/**
 * Creates an intercept to assert the response of an API call and gives
 * an alias based on the last segment of the endpoint path
 *
 * @param method | String
 * @param endpoint | String
 */
Cypress.Commands.add('interceptApiCall', (method, endpoint) => {
    const segments = endpoint.split('/');
    const alias = segments.pop();
    cy.intercept(method, `**://${Cypress.env('BASE_URL')}/${endpoint}`).as(alias);
});

/**
 * Asserts response body of passed alias and toast message
 *
 * @param alias | String
 */
Cypress.Commands.add('assertResponse', (alias) => {
    cy.wait(alias).then(({ response }) => {
        const body = JSON.parse(response.body);
        expect(response.statusCode).to.eq(200);
        expect(body.error).to.eq(false);
        cy.get('p.v-toast__text').should('contain.text', body.msg);
        cy.get('div.v-toast__item').invoke('remove');
    });
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
    cy.handleDropdown('select#pricingPlanID', pricePlan, 1);

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
    cy.get(selector)
        .invoke('attr', 'readonly')
        .then((readonly) => {
            if (readonly) {
                // Web checkbox
                cy.get('div.cstm-form-wrap-oupreference')
                    .children()
                    .eq(labelNumber)
                    .children()
                    .eq(1)
                    .children()
                    .eq(0) // Checkbox
                    .children()
                    .eq(0)
                    .children()
                    .eq(0)
                    .click();

                // Mobile checkbox
                cy.get('div.cstm-form-wrap-oupreference')
                    .children()
                    .eq(labelNumber)
                    .children()
                    .eq(1)
                    .children()
                    .eq(1) // Checkbox
                    .children()
                    .eq(0)
                    .children()
                    .eq(0)
                    .click();
            }
        });

    // Label title
    cy.get(selector).clear().type(title);
});

/**
 * Opens add store modal and creates a new store
 *
 * @param name | String
 * @param code | String
 * @param lang | String
 * @param password | String
 */
Cypress.Commands.add('addStore', (name, code, lang, password) => {
    // Calculate UTC offset, open, and closing hours
    const today = new Date();
    const offset = 0 - today.getTimezoneOffset() / 60;
    let open = (today.getUTCHours() + offset + 2) % 24;
    let closed = (today.getUTCHours() + offset + 1) % 24;

    // Open and fill form
    cy.contains('Add').click().click();
    cy.get('#storeName').type(name);
    cy.get('#storeCode').type(code);
    cy.get('#storeLang').type(lang);
    cy.get('#open-group-1 > div > #open').select(open);
    cy.get('#closed').select(closed);
    cy.get('#UTCOffset').type(offset);
    cy.get('#password').type(password);

    // Submit and assert
    cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
});

/**
 * When passed selectors for start and end dates, selects
 * current date and 2 days from current date for start
 * and end date values
 *
 * @param startDatePicker | String
 * @param endDatePicker | String
 */
Cypress.Commands.add('handleDatePicker', (startDatePicker, endDatePicker) => {
    // Calculate start and end dates
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const _date = new Date();
    _date.setDate(_date.getDate() + 4);
    const endDate = _date.toLocaleDateString('en-CA', options);
    const startDate = new Date().toLocaleDateString('en-CA', options);
    const startDateMonth = startDate.split('-')[1];
    const EndDateMonth = endDate.split('-')[1];

    // Select Start Date
    cy.get(startDatePicker).then(($label) => {
        cy.wrap($label).click();
        cy.get(`[data-date="${startDate}"]`).click();
    });

    // Select End Date
    cy.get(endDatePicker).then(($label) => {
        cy.wrap($label).click();
        // Check if the months are different
        if (startDateMonth != EndDateMonth) {
            cy.get('button[aria-label="Next month"]').click();
        }
        cy.get(`[data-date="${endDate}"]`).click();
    });
});

/**
 * Opens add product pricing modal and creates a product fluid
 *
 * @param pricePlanName | String
 * @param pricing | Object
 * @param isDefault | Boolean
 */
Cypress.Commands.add('addProductFluid', (pricePlanName, pricing, isDefault = false) => {
    // Open modal
    cy.get('button.btn.base-button.btn-outline-default').contains('Add').click();

    // Fill form
    cy.handleDatePicker('label#example-datepicker__value_', '#timeExpires__value_');
    cy.handleDropdown('select#pricingPlanID', pricePlanName);
    cy.get('#planpricename').type(pricing.name);
    if (isDefault) {
        cy.get('label[for="isDefault"]').click();
    }
    pricing.priceFluids.forEach((priceFluid, index) => {
        cy.get(`#planAprice${index}`).type(priceFluid);
    });

    // Submit
    cy.get('button.btn.btn-primary').contains('Ok').click();
});

/**
 * Checks product table for pagination and goes to last page
 *
 * @param | None
 */
Cypress.Commands.add('getLastProductPage', () => {
    cy.get('ul[aria-label="Pagination"]').then(($pagination) => {
        const $lastPageButton = $pagination.find('button[aria-label="Go to last page"]');
        if ($lastPageButton.length) {
            cy.wrap($lastPageButton).click().wait(500);
        }
    });
});

/**
 * Checks most recently added product's price card status indicator
 *
 * @param isActive | Boolean
 */
Cypress.Commands.add('checkNewestProductStatus', (isActive) => {
    cy.getLastProductPage();

    // Check indicator
    cy.get('tbody')
        .children()
        .last()
        .find('td[aria-colindex="5"] i')
        .should('have.class', isActive ? 'green' : 'red');
});
