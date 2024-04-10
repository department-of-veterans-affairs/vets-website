import maintenanceWindows from '@@profile/mocks/endpoints/maintenance-windows';
import { loa3User72 } from '@@profile/mocks/endpoints/user';
import DirectDeposit from './page-objects/DirectDeposit';

const directDeposit = new DirectDeposit();

describe('When a dependent service for direct deposit is down', () => {
  beforeEach(() => {
    directDeposit.setup();
  });
  it('should show service down message when VA Profile has maintenance window', () => {
    cy.login(loa3User72);

    cy.intercept(
      'GET',
      '/v0/maintenance_windows',
      maintenanceWindows.createDowntimeActiveNotification([
        maintenanceWindows.SERVICES.VA_PROFILE,
      ]),
    );

    directDeposit.visitPage();

    cy.injectAxeThenAxeCheck();

    // header content for maintenance alert
    cy.findByText(
      /We can’t show your direct deposit information right now/i,
    ).should('exist');

    // body content for maintenance alert
    cy.findByText(
      /The system that handles direct deposit information is down for maintenance right now./i,
    ).should('exist');
  });
});
