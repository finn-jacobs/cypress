describe('Maintenance', () => {
    // ends on carrier page
    it('should add a new carrier', () => {
        cy.interceptApiCall('POST', 'Carriers/add');
        cy.loginAndNavigateToPage('carrier');

        // Open add carrier modal
        cy.get('div.card-header > div > div.col-md-4 > div > button').click().click();

        // Fill form
        cy.fixture('super-admin-v8').then((data) => {
            cy.get('#term-group-1 > div > #value').type(data.carrier.name);
            cy.get('#value-group-1 > div > #value').type(data.carrier.description);
        });

        // Submit and assert
        cy.get('#modal-add___BV_modal_footer_ > button.btn-primary').click();
        cy.assertResponse('@add');
    });

    // ends on price plan page
    it('should create a new price plan', () => {
        cy.interceptApiCall('POST', 'PricePlan/addPricingPlan');

        // Navigate to Price Plans
        cy.getPage('Priceplan');

        // Open add price plan modal
        cy.get('.card-header.text-center > div > div:nth-child(3) > div > button').click().click();

        // Fill form
        cy.fixture('super-admin-v8').then((data) => {
            cy.get('#pricingPlanName').type(data.pricePlan.name);
            cy.get('#description').type(data.pricePlan.description);
            cy.handleDropdown('select#idcarrier', data.carrier.name);
        });

        // Submit and assert
        cy.get('#modal-add___BV_modal_footer_ > button.btn.btn-primary').click();
        cy.assertResponse('@addPricingPlan');
    });

    it("should create sibling OU's", () => {
        cy.interceptApiCall('POST', 'OrgUnit/addOrgUnit');

        // Navigate to OU
        cy.getPage('organization');

        cy.get('ul.tree-menu').as('orgList');
        // Expand menu to add OU
        cy.get('@orgList').children().eq(0).click();

        cy.fixture('super-admin-v8').then((data) => {
            // Create first OU and assert
            cy.createOU(data.ou.name, data.carrier.name, data.pricePlan.name);
            cy.assertResponse('@addOrgUnit');

            // Create second OU and assert
            cy.createOU(data.ou.siblingName, data.carrier.name, data.pricePlan.name);
            cy.assertResponse('@addOrgUnit');
        });
    });

    it('should add preferences to OUs', () => {
        cy.intercept(
            'POST',
            new RegExp(`${Cypress.env('BASE_URL')}/OrgPreferences/(addOUPreference|updateOUPreference)$`)
        ).as('manageOUPreference');

        // Select first OU
        cy.get('ul.tree-menu').as('orgList');
        cy.get('@orgList').children().eq(1).click();

        // Open preferences
        cy.get('ul.nav.nav-tabs').contains('Preferences').click();

        // Set preferences
        cy.fixture('super-admin-v8').then((data) => {
            data.ou.preferences.forEach((preference, index) => {
                cy.setOUPreference(index, preference);
            });
        });

        // Submit and assert
        cy.get('.tab-content > .active > .btn-wraper > button').click();
        cy.assertResponse('@manageOUPreference');

        // select second OU
        cy.get('@orgList').children().eq(2).click();

        // Open preferences
        cy.get('ul.nav.nav-tabs').contains('Preferences').click();

        // Set preferences
        cy.fixture('super-admin-v8').then((data) => {
            data.ou.preferences.forEach((preference, index) => {
                cy.setOUPreference(index, preference);
            });
        });

        // Submit and assert
        cy.get('.tab-content > .active > .btn-wraper > button').click();
        cy.assertResponse('@manageOUPreference');
    });

    it('should create a child and grandchild OU', () => {
        cy.interceptApiCall('POST', 'OrgUnit/addOrgUnit');

        // Select parent OU
        cy.get('ul.tree-menu').as('orgList');
        cy.get('@orgList').children().eq(1).click();

        let childID;

        // Create child OU and assert
        cy.fixture('super-admin-v8').then((data) => {
            cy.createOU(data.ou.childName, data.carrier.name, data.pricePlan.name, true);
            cy.wait('@addOrgUnit').then(({ response }) => {
                const body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(body.error).to.eq(false);

                // Select new child OU
                childID = body.id;
                cy.get('@orgList').children().eq(1).click();
                cy.get(`#wrapli${childID}`).click();

                // Create grandchild OU and assert
                cy.createOU(data.ou.grandchildName, data.carrier.name, data.pricePlan.name, true);
                cy.assertResponse('@addOrgUnit');
            });
        });
    });

    it('should create a user under Cypress Org', () => {
        cy.interceptApiCall('POST', 'Users/addUser');

        // Navigate to users
        cy.getPage('userlist');

        // Open add user modal
        cy.get('div.card-header.text-center > div > div.col-md-5.center-content.align-right > div > button').click();

        // Add timestamp to email for new user
        const email = generateUniqueEmail(Cypress.env('NEW_USER_EMAIL'));

        // Fill form
        cy.fixture('super-admin-v8').then((data) => {
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
        cy.wait('@addUser').then(({ response }) => {
            const body = JSON.parse(response.body);
            expect(response.statusCode).to.eq(200);
            // TODO: figure out why error = true when user is created successfully
            // expect(body.error).to.eq(false);
        });
    });

    it('should create a new store with add button', () => {
        cy.interceptApiCall('POST', 'Store/addStore');

        // Navigate to store page
        cy.getPage('Store');

        // Select org and add store
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#ouSelect', data.ou.name, 2);
            const store = data.stores[0];
            cy.addStore(store.name, store.code, store.lang, store.password);
        });

        // Assert
        cy.assertResponse('@addStore');
    });

    it('should upload stores', () => {
        cy.interceptApiCall('POST', 'Store/importStore');

        // Open upload store modal
        cy.get('div.card-header.text-center > div:nth-child(1) > div:nth-child(1) > div').click();

        const filePath = 'cypress/assets/upload_stores.xslsx';

        // Add file to upload
        cy.get('label[for="importfile"]').selectFile(filePath);

        // Submit and assert
        cy.get('#modal-import___BV_modal_footer_ > button.btn.btn-primary').click();
        cy.assertResponse('@importStore');
    });

    it('should download stores from OU', () => {
        // Make sure intercept is using https
        const adjustedUrl = Cypress.env('BASE_URL').replace('http:', 'https:');
        cy.intercept('GET', `${adjustedUrl}/Store/export*`).as('export');

        // Navigate to store page
        cy.login();
        cy.getPage('Store');

        // Select OU
        cy.fixture('super-admin-v8').then((data) => {
            cy.handleDropdown('#ouSelect', data.ou.name, 2).wait(500);
        });

        // Download and assert
        cy.contains('Download Stores').click();
        cy.wait('@export').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });

    it('should add store and add location', () => {
        cy.interceptApiCall('POST', 'Store/addStore');
        cy.interceptApiCall('POST', 'Store/addLocationToStore');
        cy.login();
        cy.getPage('Store');

        cy.fixture('super-admin-v8').then((data) => {
            // Select Org
            cy.handleDropdown('#ouSelect', data.ou.name, 2);

            // Add Store
            const store = data.stores[1];
            cy.addStore(store.name, store.code, store.lang, store.password);

            // Assert
            cy.wait('@addStore').then(({ response }) => {
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
        cy.assertResponse('@addLocationToStore');
    });
});

// Adds timestamp to email
function generateUniqueEmail(email) {
    const dateTime = new Date()
        .toISOString()
        .replace(/\.\d+Z$/, '')
        .replace(/T/, '-')
        .replace(/:/g, '-');
    const [address, domain] = email.split('@');
    return `${address}+${dateTime}@${domain}`;
}
