/* eslint-disable @department-of-veterans-affairs/axe-check-required */
// axe checks are being made, but aren't being caught be the linter
import maintenanceWindows from '../../utilities/mocks/endpoints/maintenance-windows';
import user from './fixtures/mocks/user.json';

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '**/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
  cy.intercept('GET', '**authorize_as_representative', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

const createUpcomingMaintenanceWindow = () => {
  cy.intercept(
    'GET',
    'v0/maintenance_windows',
    maintenanceWindows.createDowntimeApproachingNotification([
      maintenanceWindows.SERVICES.global,
    ]),
  );
};

const createActiveMaintenanceWindow = () => {
  cy.intercept(
    'GET',
    'v0/maintenance_windows',
    maintenanceWindows.createDowntimeActiveNotification([
      maintenanceWindows.SERVICES.global,
    ]),
  );
};

const upcomingHeader = 'Upcoming site maintenance';
const activeHeader = 'Site maintenance';

const checkBannerExists = headerText => {
  cy.get('va-maintenance-banner')
    .shadow()
    .contains(headerText);
  cy.injectAxeThenAxeCheck();
};

const checkBannerDismissed = () => {
  cy.get('va-maintenance-banner')
    .shadow()
    .should('not.exist');
  cy.injectAxeThenAxeCheck();
};

const dismissBanner = () => {
  cy.get('va-maintenance-banner')
    .shadow()
    .get('button[aria-label="Close notification"]')
    .click();
};

describe('ArpMaintenanceWindowBanner', () => {
  describe('Unauthenticated', () => {
    it('Upcoming banner is displayed and dismissed', () => {
      createUpcomingMaintenanceWindow();
      cy.visit('/representative');

      checkBannerExists(upcomingHeader);

      dismissBanner();
      checkBannerDismissed();

      // banner remains dismissed
      cy.visit('/representative');
      checkBannerDismissed();
    });

    it('Current banner is displayed and dismissed', () => {
      createActiveMaintenanceWindow();
      cy.visit('/representative');

      checkBannerExists(activeHeader);

      dismissBanner();
      checkBannerDismissed();

      // banner remains dismissed
      cy.visit('/representative');
      checkBannerDismissed();
    });
  });

  describe('Authenticated', () => {
    beforeEach(() => {
      cy.loginArpUser();
    });
    it('Upcoming banner is displayed and dismissed', () => {
      createUpcomingMaintenanceWindow();
      cy.visit('/representative/dashboard');

      checkBannerExists(upcomingHeader);

      dismissBanner();
      checkBannerDismissed();

      // banner remains dismissed
      cy.visit('/representative/dashboard');
      checkBannerDismissed();
    });

    it('Current banner is displayed and dismissed', () => {
      createActiveMaintenanceWindow();
      cy.visit('/representative/dashboard');

      checkBannerExists(activeHeader);

      dismissBanner();
      checkBannerDismissed();

      // banner remains dismissed
      cy.visit('/representative/dashboard');
      checkBannerDismissed();
    });
  });
});
