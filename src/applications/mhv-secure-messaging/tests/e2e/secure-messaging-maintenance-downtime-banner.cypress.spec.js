import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Alerts, Paths } from './utils/constants';

describe('SM Maintenance Banner', () => {
  const currentDate = new Date();
  const upcomingDate = new Date(currentDate);
  upcomingDate.setHours(upcomingDate.getHours() + 1);
  const endDate = new Date(currentDate);
  endDate.setHours(endDate.getHours() + 5);

  const activeMaintenanceData = PatientInboxPage.maintenanceWindowResponse(
    currentDate,
    endDate,
  );

  const upcomingMaintenanceData = PatientInboxPage.maintenanceWindowResponse(
    upcomingDate,
    endDate,
  );

  describe('Inbox Maintenance Banner', () => {
    it('verify active maintenance', () => {
      cy.intercept(
        `GET`,
        Paths.INTERCEPT.MAINTENANCE_WINDOWS,
        activeMaintenanceData,
      ).as(`maintenance_windows`);

      SecureMessagingSite.login();
      cy.visit(Paths.UI_MAIN + Paths.INBOX);

      GeneralFunctionsPage.verifyMaintenanceBanner(
        currentDate,
        endDate,
        Alerts.MAINTENANCE.ACTIVE,
      );

      // axeCheck() verification could not be added due to page content absence
    });

    it('verify upcoming maintenance', () => {
      cy.intercept(
        `GET`,
        Paths.INTERCEPT.MAINTENANCE_WINDOWS,
        upcomingMaintenanceData,
      ).as(`maintenance_windows`);

      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();

      GeneralFunctionsPage.verifyMaintenanceBanner(
        upcomingDate,
        endDate,
        Alerts.MAINTENANCE.UPCOMING,
      );

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Compose Maintenance Banner', () => {
    it(`verify active maintenance`, () => {
      cy.intercept(
        `GET`,
        Paths.INTERCEPT.MAINTENANCE_WINDOWS,
        activeMaintenanceData,
      ).as(`maintenance_windows`);

      SecureMessagingSite.login();
      cy.visit(`/my-health/secure-messages/new-message/`);

      GeneralFunctionsPage.verifyMaintenanceBanner(
        currentDate,
        endDate,
        Alerts.MAINTENANCE.ACTIVE,
      );

      // axeCheck() verification could not be added due to page content absence
    });

    it(`verify upcoming maintenance`, () => {
      cy.intercept(
        `GET`,
        Paths.INTERCEPT.MAINTENANCE_WINDOWS,
        upcomingMaintenanceData,
      ).as(`maintenance_windows`);

      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      PatientInboxPage.navigateToComposePage();

      GeneralFunctionsPage.verifyMaintenanceBanner(
        upcomingDate,
        endDate,
        Alerts.MAINTENANCE.UPCOMING,
      );

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
