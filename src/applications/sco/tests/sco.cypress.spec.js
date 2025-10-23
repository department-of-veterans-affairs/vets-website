describe('SCO page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'forms_10215_10216_release',
            value: true,
          },
        ],
      },
    });
  });
  it('Shows forms 10215 and 10216 digital form links if feature toggle on', () => {
    cy.visit('/school-administrators');
    cy.injectAxeThenAxeCheck();
    cy.contains('Accepted forms for digital submission').should.exist;
  });
});
