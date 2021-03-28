import featureTogglesEnabled from './fixtures/toggle-covid-feature-enhanced-eligibility.json';

describe('COVID-19 Vaccination Preparation Form', () => {
  describe('when entering app with auth turned off', () => {
    before(() => {
      cy.server();
      cy.route('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
        'feature',
      );
      cy.visit('health-care/covid-19-vaccine/sign-up/stay-informed/');
      cy.wait('@feature');
      cy.injectAxe();
    });

    it('should launch app from the continue button', () => {
      // Intro page
      cy.axeCheck();
      cy.get('.vads-l-row').contains('What you should know about signing up');

      cy.get('.usa-button').contains('Sign up now');

      cy.findByText('Sign up now', { selector: 'a' }).click();

      // Form page
      cy.url().should(
        'include',
        'health-care/covid-19-vaccine/sign-up/introduction',
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.get('#content').contains(
        'To get started, tell us about your experience with VA health care.',
      );
    });
  });
});
