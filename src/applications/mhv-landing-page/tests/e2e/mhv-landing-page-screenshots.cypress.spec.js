import { appName } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

// Screenshots save to 'vets-website/cypress/screenshots'

const viewports = ['va-top-mobile-1', 'va-top-desktop-2'];

Cypress.Commands.add('saveScreenshot', filename => {
  cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
  // set scroll behavior to default
  cy.get('html, body').invoke(
    'attr',
    'style',
    'height: auto; scroll-behavior: auto;',
  );
  cy.screenshot(filename, { overwrite: true });
});

viewports.forEach(viewport => {
  describe(`${appName} -- ${viewport} screenshots`, () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      ApiInitializer.initializeMessageData.withNoUnreadMessages();
      cy.intercept('/data/cms/vamc-ehr.json', {});
      cy.viewportPreset(viewport);
    });

    it("displays 'Identity not verified' alert", () => {
      LandingPage.visit({ verified: false });
      cy.saveScreenshot(`my-health--alert--identity-not-verified--${viewport}`);
      cy.injectAxeThenAxeCheck();
    });

    it("displays 'You don't have access' alert", () => {
      LandingPage.visit({ registered: false });
      cy.saveScreenshot(`my-health--alert--you-dont-have-access--${viewport}`);
      cy.injectAxeThenAxeCheck();
    });

    it('renders', () => {
      LandingPage.visit();
      cy.saveScreenshot(`my-health--${viewport}`);
      cy.injectAxeThenAxeCheck();
    });
  });
});
