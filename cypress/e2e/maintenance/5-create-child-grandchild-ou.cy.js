describe('test', () => {
    it('should create a child OU', () => {
        cy.interceptApiCall('POST', 'OrgUnit/addOrgUnit');
        cy.login();
        cy.getPage('organization');
    
        // Select parent OU
        cy.get('ul.tree-menu').as('orgList');
        cy.get('@orgList').children().eq(1).click();

        let childID;

        // Create child OU
        cy.fixture('super-admin-v8').then(data => {
            cy.createOU(data.ou.childName, data.carrier.name, data.pricePlan.name, true);
            cy.wait('@addOrgUnit').then(({response}) => {
                const body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(body.error).to.eq(false);

                // Select new child OU
                childID = body.id;
                cy.get('@orgList').children().eq(1).click();
                cy.get(`#wrapli${childID}`).click();

                // Create grandchild OU
                cy.createOU(data.ou.grandchildName, data.carrier.name, data.pricePlan.name, true);
                cy.wait('@addOrgUnit').then(({response}) => {
                    const body = JSON.parse(response.body);
                    expect(response.statusCode).to.eq(200);
                    expect(body.error).to.eq(false);
                });
            });
        });
    });
});