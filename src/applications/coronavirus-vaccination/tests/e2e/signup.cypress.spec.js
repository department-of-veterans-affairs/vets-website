import featureTogglesEnabled from './fixtures/toggle-covid-feature.json';

describe('COVID-19 Vaccination Preparation Form', () => {
  describe('when entering valid contact information without signing in', () => {
    before(() => {
      cy.intercept('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
        'feature',
      );
      cy.visit('health-care/covid-19-vaccine/stay-informed/');
      cy.wait('@feature');
      cy.injectAxe();
    });

    it('should successfully submit the vaccine preparation form', () => {
      // Intro page
      cy.axeCheck();
      cy.get('.vads-l-row').contains('What you should know about signing up');
      // Expand all Accordions with keyboard and test for A11y

      cy.get('va-accordion-item')
        .first()
        .get('button')
        .first()
        .type('{shift}');
      cy.get('div').contains(
        'Contacting Veterans who we know plan to get a vaccine helps us do the most good with our limited supply.',
      );

      cy.get('va-accordion-item')
        .next()
        .get('button')
        .first()
        .type('{shift}');
      cy.get('div').contains(
        'If you want to learn more before you decide your plans:',
      );

      cy.get('va-accordion-item')
        .next()
        .get('button')
        .first()
        .type('{shift}');
      cy.get('div').contains(
        'you don’t have to provide your Social Security number. ',
      );

      cy.get('va-accordion-item')
        .next()
        .get('button')
        .first()
        .type('{shift}');
      cy.get('div').contains(
        'Your local VA health facility may contact you by phone, email, or text message. If you’re eligible and want to get a vaccine, we encourage you to respond.',
      );
      cy.get('.help-talk').contains(
        'If you have questions or need help filling out this form, call our MyVA411 main information line at 800-698-2411 (TTY: 711).',
      );
      cy.axeCheck();

      cy.get('.usa-button').contains('Sign in');

      cy.findByText('Continue without signing in', { selector: 'a' }).click();

      // Form page
      cy.url().should(
        'include',
        '/health-care/covid-19-vaccine/stay-informed/form',
      );
      cy.axeCheck();
      cy.get('#covid-vaccination-heading-form').contains(
        'Sign up for vaccine updates',
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

      cy.get('.help-talk').contains(
        'If you have questions or need help filling out this form, call our MyVA411 main information line at 800-698-2411 (TTY: 711).',
      );

      cy.axeCheck();
      cy.intercept('POST', '**/covid_vaccine/v0/registration', {
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
    });
  });
});
