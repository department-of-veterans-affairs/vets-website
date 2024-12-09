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
        maintenanceWindows.SERVICES.LIGHTHOUSE_DIRECT_DEPOSIT,
      ]),
    );

    directDeposit.visitPage();

    cy.injectAxeThenAxeCheck();

    cy.findByText(/This application is down for maintenance/i).should('exist');
  });
});
