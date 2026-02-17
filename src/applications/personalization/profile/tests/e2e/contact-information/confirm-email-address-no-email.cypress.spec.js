import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';
import ContactInformationPage from './pages/ContactInformationPage';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

const setup = () => {
  mockFeatureToggles(() => ({
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhvEmailConfirmation',
          value: true,
        },
      ],
    },
  }));

  const mockUserNoEmail = { ...mockUser };
  mockUserNoEmail.data.attributes.vet360ContactInformation.email.emailAddress =
    null;
  cy.login(mockUserNoEmail);

  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/direct_deposits',
  ]);

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: mockUserNoEmail,
  }).as('finalUserRequest');

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
  cy.wait('@mockUser');
};

describe('MHV Email Confirmation Alert - Add Email', () => {
  beforeEach(() => {
    setup();
    // Clear the MHV email confirmation alert cookie to ensure clean test state
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
  });

  it('should not show the error alert when the feature flag is disabled', () => {
    mockFeatureToggles(() => ({
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhvEmailConfirmation',
            value: false,
          },
        ],
      },
    }));

    cy.findByTestId('profile-alert--confirm-contact-email').should('not.exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should focus the email address field when "Add a contact email" is clicked', () => {
    cy.findByTestId('profile-alert--add-contact-email').should('be.visible');
    cy.findByTestId('profile-alert--add-contact-email').findByRole('heading', {
      level: 3,
      name: /Add a contact email/,
    });
    ContactInformationPage.clickAddEmailAddress();

    cy.get('va-text-input[name="root_emailAddress"]')
      .should('be.visible')
      .shadow()
      .find('input#inputField')
      .should('have.focus');

    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the skip success alert and clear the cookie when clicking "Skip adding an email"', () => {
    ContactInformationPage.clickSkipAddingEmailAddress();

    cy.findByTestId('mhv-alert--skip-success').should('be.visible');
    cy.findByTestId('mhv-alert--skip-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });
});
