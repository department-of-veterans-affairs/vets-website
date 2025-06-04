import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Alerts, Paths } from './utils/constants';

describe('SM Maintenance Banner', () => {
  describe('Active Maintenance Banner', () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setHours(endDate.getHours() + 5);

    const activeMaintenanceData = PatientInboxPage.maintenanceWindowResponse(
      currentDate,
      endDate,
    );

    it('verify inbox active maintenance', () => {
      cy.log(GeneralFunctionsPage.getDateFormat(currentDate));
      cy.log(GeneralFunctionsPage.getDateFormat(endDate));

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

      cy.injectAxe();
      cy.axeCheck('.vads-l-grid-container');
    });

    it(`verify compose active maintenance`, () => {
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
      cy.injectAxe();
      cy.axeCheck('.vads-l-grid-container');
    });

    it('verify maintenance window is bypassed when a feature flag is enabled', () => {
      cy.intercept(
        `GET`,
        Paths.INTERCEPT.MAINTENANCE_WINDOWS,
        activeMaintenanceData,
      ).as(`maintenance_windows`);

      const customFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
        {
          name: 'mhv_bypass_downtime_notification',
          value: true,
        },
      ]);

      SecureMessagingSite.login(customFeatureToggles);
      PatientInboxPage.loadInboxMessages();
      GeneralFunctionsPage.verifyMaintenanceBanner(
        currentDate,
        endDate,
        Alerts.MAINTENANCE.ACTIVE,
      );
      GeneralFunctionsPage.verifyPageHeader(`Messages: Inbox`);
      PatientInboxPage.verifyFilterMessageHeadingText();
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Upcoming Maintenance Banner', () => {
    const upcomingDate = new Date();
    upcomingDate.setHours(upcomingDate.getHours() + 1);
    const endDate = new Date(upcomingDate);
    endDate.setHours(endDate.getHours() + 5);

    const upcomingMaintenanceData = PatientInboxPage.maintenanceWindowResponse(
      upcomingDate,
      endDate,
    );

    it('verify inbox upcoming maintenance', () => {
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

    it(`verify compose upcoming maintenance`, () => {
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
