import mockUser from '../fixtures/user.json';
import mockNonSMUser from '../fixtures/non_sm_user.json';
import mockStatus from '../fixtures/profile-status.json';

class SecureMessagingSite {
  login = (isSMUser = true) => {
    if (isSMUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'mhv_secure_messaging_to_va_gov_release',
              value: true,
            },
          ],
        },
      }).as('featureToggle');
    } else {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/v0/user', mockNonSMUser).as('mockUser');
      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'mhv_secure_messaging_to_va_gov_release',
              value: false,
            },
          ],
        },
      }).as('featureToggle');
    }
  };

  loadPageUnauthenticated = () => {
    cy.visit('my-health/secure-messages/');
    cy.wait('@mockUser');
  };
}
export default new SecureMessagingSite();
