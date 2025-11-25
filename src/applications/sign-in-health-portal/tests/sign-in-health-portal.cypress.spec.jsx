describe('Sign In Health Portal', () => {
  [false, true].forEach(value => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'dslogon_button_disabled',
              value,
            },
          ],
        },
      }).as('featureToggles');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    });
  });

  it('should render the portal removal notice page', () => {
    cy.visit('/sign-in-health-portal/');
    cy.get('h1').should('be.visible');
    cy.get('h1').should(
      'contain',
      'Manage your health care for all VA facilities on VA.gov',
    );
  });
});
