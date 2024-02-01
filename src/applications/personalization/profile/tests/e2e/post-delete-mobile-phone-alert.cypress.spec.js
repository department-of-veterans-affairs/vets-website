import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import transactionReceived from '@@profile/tests/fixtures/transactions/received-transaction.json';
import transactionSucceeded from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import { makeUserObject } from '~/applications/personalization/common/helpers';
import { makeMockContactInfo } from '~/platform/user/profile/vap-svc/util/local-vapsvc.js';

import { mockFeatureToggles, mockNotificationSettingsAPIs } from './helpers';
import { PROFILE_PATHS } from '../../constants';

describe('Contact info update success alert', () => {
  beforeEach(() => {
    mockFeatureToggles();
    mockNotificationSettingsAPIs();
    const contactInfoWithoutMobilePhone = makeMockContactInfo();
    contactInfoWithoutMobilePhone.mobilePhone = null;
    const userWithoutMobilePhone = makeUserObject({
      contactInformation: contactInfoWithoutMobilePhone,
    });
    const userWithMobilePhone = makeUserObject();
    cy.login(userWithMobilePhone);
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
    cy.intercept('DELETE', '/v0/profile/telephones', {
      statusCode: 200,
      body: transactionReceived,
    });
    cy.intercept('GET', '/v0/profile/status/*', {
      statusCode: 200,
      body: transactionSucceeded,
    });
    cy.intercept('GET', '/v0/user?*', {
      statusCode: 200,
      body: userWithoutMobilePhone,
    });
  });
  it('should be shown after deleting mobile phone number', () => {
    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

    cy.findByRole('button', { name: /remove mobile phone/i }).click({
      waitForAnimations: true,
    });

    cy.injectAxeThenAxeCheck();

    // confirm the deletion action. This button is _not_ the same as the one
    // that was just clicked in the previous step
    cy.findByRole('button', { name: 'Yes, remove my information' }).click();

    cy.injectAxeThenAxeCheck();

    cy.findByText(/update saved/i).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
