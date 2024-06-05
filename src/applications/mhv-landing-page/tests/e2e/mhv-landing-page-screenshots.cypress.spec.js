import { appName } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

// Screenshots save to 'vets-website/cypress/screenshots'

Cypress.Commands.add('saveScreenshot', (...args) => {
  const filename = args.join('--');
  cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
  // set scroll behavior to default
  cy.get('html, body').invoke(
    'attr',
    'style',
    'height: auto; scroll-behavior: auto;',
  );
  cy.screenshot(filename, { overwrite: true });
});

const viewports = ['va-top-mobile-1', 'va-top-desktop-2'];

const executeTests = viewport => {
  describe(`${appName} -- ${viewport} screenshots`, () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      ApiInitializer.initializeMessageData.withNoUnreadMessages();
      cy.intercept('/data/cms/vamc-ehr.json', {});
      cy.viewportPreset(viewport);
    });

    it('not-verified', () => {
      LandingPage.visit({ verified: false });
      cy.saveScreenshot(viewport, 'my-health', Cypress.currentTest.title);
      cy.injectAxeThenAxeCheck();
    });

    it('not-registered', () => {
      LandingPage.visit({ registered: false });
      cy.saveScreenshot(viewport, 'my-health', Cypress.currentTest.title);
      cy.injectAxeThenAxeCheck();
    });

    it('registered', () => {
      LandingPage.visit();
      cy.saveScreenshot(viewport, 'my-health', Cypress.currentTest.title);
      cy.injectAxeThenAxeCheck();
    });
  });
};

(async () => {
  if (!Cypress.env('with_screenshots')) {
    return;
  }

  viewports.forEach(viewport => executeTests(viewport));
})();

describe('mhv-landing-page-screenshots', () => {
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
