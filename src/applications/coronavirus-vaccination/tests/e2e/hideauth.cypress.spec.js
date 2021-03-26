import featureTogglesEnabled from './fixtures/toggle-covid-feature-hide-auth.json';

describe('COVID-19 Vaccination Preparation Form', () => {
  describe('when entering app with auth turned off', () => {
    before(() => {
      cy.server();
      cy.route('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
        'feature',
      );
      cy.visit('health-care/covid-19-vaccine/stay-informed/');
      cy.wait('@feature');
      cy.injectAxe();
    });

    it('should launch app from the continue button', () => {
      // Intro page
      cy.axeCheck();
      cy.get('.vads-l-row').contains(
        'Stay informed about getting a COVID-19 vaccine at VA',
      );

      cy.get('.usa-button').contains('Sign up now');

      cy.findByText('Sign up now', { selector: 'a' }).click();

      // Form page
      cy.url().should(
        'include',
        '/health-care/covid-19-vaccine/stay-informed/form',
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.get('#covid-vaccination-heading-form').contains(
        'Fill out the form below',
      );

      cy.findByLabelText(/First name/i)
        .clear()
        .type('Testing');

      cy.findByLabelText(/Last name/i)
        .clear()
        .type('Veteran');

      cy.findByLabelText(/^Month/).select('June');

      cy.findByLabelText(/^Day/).select('30');

      cy.findByLabelText(/Year/i)
        .clear()
        .type('1950');

      cy.findByLabelText(/Email address/i)
        .clear()
        .type('test@example.com');

      cy.findByLabelText(/Phone/i)
        .clear()
        .type('8005551234');

      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('10001');

      cy.get('#root_locationDetails-label').contains(
        'Will you be in this zip code for the next 6 to 12 months?',
      );
      cy.get('#root_locationDetails_0').check();

      cy.get('#root_vaccineInterest-label').contains(
        'Do you plan to get a COVID-19 vaccine when one is available to you?',
      );
      cy.get('#root_vaccineInterest_0').check();

      cy.axeCheck();
      cy.route('POST', '**/covid_vaccine/v0/registration', {
        status: 200,
      }).as('response');

      cy.get('.usa-button').contains('Submit form');
      cy.get('.usa-button').click();
      cy.wait('@response');

      // Confirmation page
      cy.url().should(
        'include',
        '/health-care/covid-19-vaccine/stay-informed/confirmation',
      );
      cy.axeCheck();
      cy.get('#covid-vaccination-heading-confirmation').contains(
        "We've received your information",
      );

      cy.get('.vads-l-row').contains(
        'Thank you for signing up to stay informed about COVID-19 vaccines at VA',
      );
      cy.get('.vads-l-row').contains(
        'Your local VA health facility may also use the information you provided to determine when to contact you about getting a vaccine once your risk group becomes eligible',
      );
      cy.get('.vads-l-row').contains(
        'Your local VA health facility may contact you by phone, email, or text message.',
      );
      cy.get('.vads-l-row').contains(
        'By sharing your plans for getting a vaccine, you help us better plan our efforts',
      );
    });
  });
});
