import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';
describe('MHV Email Confirmation Alert - Add Email', () => {
  beforeEach(() => {
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    cy.login(user);
    cy.visit(rootUrl);
  });

  it('should focus the email address field when "Add a contact email" is clicked', () => {
    LandingPage.clickAddEmail();

    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#email-address');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the skip success alert and clear the cookie when clicking "Skip adding an email"', () => {
    LandingPage.clickSkipAddingEmail();

    cy.findByTestId('mhv-alert--skip-success').should('be.visible');
    cy.findByTestId('mhv-alert--skip-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });
});
