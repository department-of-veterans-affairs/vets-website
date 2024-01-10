import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockBasicUser from '../fixtures/userResponse/basic-user.json';

import { AXE_CONTEXT } from '../utils/constants';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';

describe('Secure Messaging Basic User', () => {
  it('verify user has not access to secure-messaging', () => {
    const site = new SecureMessagingSite();
    site.login(true, mockBasicUser);
    SecureMessagingLandingPage.loadMainPage(mockBasicUser);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.location('pathname').should('eq', '/health-care/secure-messages/');
  });
});
