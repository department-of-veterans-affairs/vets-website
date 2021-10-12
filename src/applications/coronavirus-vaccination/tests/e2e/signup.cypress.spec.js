import featureTogglesEnabled from './fixtures/toggle-covid-feature.json';
import StayInformedPage from './page-objects/StayInformedPage';

describe('COVID-19 Vaccination Preparation Form', () => {
  describe('when entering valid contact information without signing in', () => {
    before(() => {
      cy.intercept('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
        'feature',
      );
    });

    it('should successfully submit the vaccine preparation form', () => {
      const stayInformedPage = new StayInformedPage();

      // Intro page
      stayInformedPage.loadPage();

      // Expand all accordions with keyboard and test for A11y
      stayInformedPage.checkAccordions([
        'Contacting Veterans who we know plan to get a vaccine helps us do the most good with our limited supply.',
        'If you want to learn more before you decide your plans:',
        'you don’t have to provide your Social Security number. ',
        'Your local VA health facility may contact you by phone, email, or text message. If you’re eligible and want to get a vaccine, we encourage you to respond.',
        'If you have questions or need help filling out this form, call our MyVA411 main information line at 800-698-2411 (TTY: 711).',
      ]);

      stayInformedPage.continueWithoutSigningIn(true);

      // Fill out form
      stayInformedPage.sameZipCode(true);
      stayInformedPage.vaccineInterest(true);
      stayInformedPage.checkForHelpInfo();
      stayInformedPage.fillForm([
        { field: /First Name/i, value: 'Testing', clear: true },
        { field: /Last name/i, value: 'Veteran', clear: true },
        { field: /Month/i, value: 'June', clear: false },
        { field: /Day/i, value: '30', clear: false },
        { field: /Year/i, value: '1950', clear: true },
        { field: /Email address/i, value: 'test@example.com', clear: true },
        { field: /Phone/i, value: '8005551234', clear: true },
        { field: /Zip code/i, value: '10001', clear: true },
      ]);

      stayInformedPage.submitForm();
      stayInformedPage.validateSubmission();
    });
  });
});
