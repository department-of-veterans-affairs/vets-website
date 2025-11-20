import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

const clickAddEmail = () => {
  cy.get('va-alert[data-testid="mhv-alert--add-contact-email"]')
    .find('va-link-action')
    .shadow()
    .find('a')
    .click();
};

const clickSkipAddingEmail = () => {
  cy.get('va-alert[data-testid="mhv-alert--add-contact-email"]').within(() => {
    cy.get('va-button[secondary]')
      .shadow()
      .find('button')
      .click();
  });
};

describe('MHV Email Confirmation Alert - Add Email', () => {
  beforeEach(() => {
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    cy.login(user);
    cy.visit(rootUrl);
  });

  it('should focus the email address field when "Add a contact email" is clicked', () => {
    clickAddEmail();

    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#contact-email-address');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the skip success alert and clear the cookie when clicking "Skip adding an email"', () => {
    clickSkipAddingEmail();

    cy.findByTestId('mhv-alert--skip-success').should('be.visible');
    cy.findByTestId('mhv-alert--skip-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });
});
