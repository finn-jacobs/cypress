describe('testing', () => {

it('should check the new ar available in create product static', () => {    
    cy.loginAndNavigateToPage('ProductStatic');
    cy.get('button.btn.base-button.btn-outline-default')
        .contains('Add')
        .click().click();

    // cy.handleDropdown('select#aspectRatiAddEditModalo', )

})
})