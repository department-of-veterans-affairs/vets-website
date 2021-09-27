import { makeMockContactInfo } from '~/platform/user/profile/vap-svc/util/local-vapsvc.js';
import { makeUserObject } from '~/applications/personalization/common/helpers';

import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import transactionReceived from '@@profile/tests/fixtures/transactions/received-transaction.json';
import transactionSucceeded from '@@profile/tests/fixtures/transactions/finished-transaction.json';

import { mockFeatureToggles, mockNotificationSettingsAPIs } from './helpers';
import { PROFILE_PATHS } from '../../constants';

describe('Return to Notification Settings CTA', () => {
  beforeEach(() => {
    mockFeatureToggles();
    mockNotificationSettingsAPIs();
    const contactInfoWithoutMobilePhone = makeMockContactInfo();
    contactInfoWithoutMobilePhone.mobilePhone = null;
    const userWithoutMobilePhone = makeUserObject({
      contactInformation: contactInfoWithoutMobilePhone,
    });
    const userWithMobilePhone = makeUserObject();
    cy.login(userWithoutMobilePhone);
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
    cy.intercept('POST', '/v0/profile/telephones', {
      statusCode: 200,
      body: transactionReceived,
    });
    cy.intercept('GET', '/v0/profile/status/*', {
      statusCode: 200,
      body: transactionSucceeded,
    });
    cy.intercept('GET', '/v0/user?*', {
      statusCode: 200,
      body: userWithMobilePhone,
    });
  });
  // TODO remove the skip once we can confirm this works well on staging and we
  // confirm the non-CTA message to show in the
  // ContactInformationSaveSuccessAlert component
  it.skip('should be shown after adding mobile phone number', () => {
    cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
    cy.findByRole('link', { name: /add.*mobile phone/i }).click();
    cy.findByRole('button', { name: /edit mobile phone/i })
      .should('be.focused')
      // I'd like to simulate hitting `enter` instead of clicking, but doing
      // .type('{enter}') does not work because a button cannot receive a
      // .type() call
      .click();

    cy.injectAxeThenAxeCheck();
    // this serves as a test that the text field has focus when you enter edit
    // mode for a piece of contact info
    cy.focused()
      .clear()
      .type('4155551234{enter}');
    cy.injectAxeThenAxeCheck();

    cy.findByText(/update saved/i).should('exist');
    cy.injectAxeThenAxeCheck();
    cy.findByRole('link', { name: /manage text notifications/i }).click();

    cy.url().should('contain', PROFILE_PATHS.NOTIFICATION_SETTINGS);
  });
});
