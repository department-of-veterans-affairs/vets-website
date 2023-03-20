import featureTogglesEnabled from './fixtures/toggle-covid-feature-hide-auth.json';
import StayInformedPage from './page-objects/StayInformedPage';

describe('COVID-19 Vaccination Preparation Form', () => {
  describe('when entering app with auth turned off', () => {
    // before(() => {
    //   cy.intercept('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
    //     'feature',
    //   );
    // });

    it('should launch app from the continue button', () => {
      const stayInformedPage = new StayInformedPage();

      // Intro page
      stayInformedPage.loadPage();
      stayInformedPage.continueWithoutSigningIn();

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
