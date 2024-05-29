import { appName } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

// Screenshots save to 'vets-website/cypress/screenshots'

const viewports = ['va-top-mobile-1', 'va-top-desktop-1'];

Cypress.Commands.add('saveScreenshot', filename => {
  cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
  // set scroll behavior to default
  cy.get('html, body').invoke(
    'attr',
    'style',
    'height: auto; scroll-behavior: auto;',
  );
  cy.screenshot(filename, { overwrite: true });
});

viewports.forEach(size => {
  describe(`${appName} -- ${size} screenshots`, () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      ApiInitializer.initializeMessageData.withNoUnreadMessages();
      cy.intercept('/data/cms/vamc-ehr.json', {});
      cy.viewportPreset(size);
    });

    it("displays 'Identity not verified' alert", () => {
      LandingPage.visit({ verified: false });
      cy.saveScreenshot(`my-health--alert--identity-not-verified--${size}`);
      cy.injectAxeThenAxeCheck();
    });

    it("displays 'You don't have access' alert", () => {
      LandingPage.visit({ registered: false });
      cy.saveScreenshot(`my-health--alert--you-dont-have-access--${size}`);
      cy.injectAxeThenAxeCheck();
    });

    it('renders', () => {
      LandingPage.visit();
      cy.saveScreenshot(`my-health--${size}`);
      cy.injectAxeThenAxeCheck();
    });
  });
});
