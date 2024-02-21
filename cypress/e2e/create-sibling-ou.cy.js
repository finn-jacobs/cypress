describe('Test', () => {
    it("should create sibling OU's", () => {
        cy.interceptApiCall('POST', 'OrgUnit/addOrgUnit', 'addOrgUnit');
        
        cy.login();
        // Navigate to OU
        cy.getPage('organization');
        
        cy.get('ul.tree-menu').as('orgList');
        // Expand menu to add OU
        cy.get('@orgList').children().eq(0).click();
        
        cy.fixture('super-admin-v8').then(data => {
            // Create first OU and assert
            cy.createOU(data.ou.name, data.carrier.name, data.pricePlan.name);
            cy.wait('@addOrgUnit').then(({response}) => {
                const body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(body.error).to.eq(false);
            });
            
            // Create second OU and assert
            cy.createOU(data.ou.siblingName, data.carrier.name, data.pricePlan.name);
            cy.wait('@addOrgUnit').then(({response}) => {
                const body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(body.error).to.eq(false);
            });
        });
    });
});