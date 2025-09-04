import { appName } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

describe(`${appName} -- confirm contact email`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
  });

  it('displays the confirm contact email alert', () => {
    LandingPage.visit();
    cy.findByTestId('va-profile--confirm-contact-email-link');
    cy.injectAxeThenAxeCheck();
  });

  it('suppresses the confirm contact email alert when dismissed', () => {
    cy.setCookie('CONTACT_EMAIL_CONFIRMED', 'true');
    LandingPage.visit();
    cy.findByTestId('va-profile--confirm-contact-email-link');
    cy.injectAxeThenAxeCheck();
  });
});
