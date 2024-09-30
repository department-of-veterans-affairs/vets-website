import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Alerts, Paths, Locators } from './utils/constants';

describe('SM Inbox Maintenance Banner', () => {
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

  it('verify active maintenance', () => {
    cy.intercept(
      `GET`,
      Paths.INTERCEPT.MAINTENANCE_WINDOWS,
      activeMaintenanceData,
    ).as(`maintenance_windows`);

    SecureMessagingSite.login();
    cy.visit(Paths.UI_MAIN + Paths.INBOX);

    cy.get(Locators.ALERTS.VA_ALERT)
      .find(`h2`)
      .should(`be.visible`)
      .and(`have.text`, Alerts.MAINTENANCE.ACTIVE);

    cy.contains(`Start`)
      .parent(`p`)
      .should(`contain.text`, GeneralFunctionsPage.getDateFormat(currentDate));
    cy.contains(`End`)
      .parent(`p`)
      .should(`contain.text`, GeneralFunctionsPage.getDateFormat(endDate));

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

    cy.get(Locators.ALERTS.VA_ALERT)
      .find(`h2`)
      .should(`be.visible`)
      .and(`have.text`, Alerts.MAINTENANCE.UPCOMING);

    cy.contains(`Start`)
      .parent(`p`)
      .should(`contain.text`, GeneralFunctionsPage.getDateFormat(upcomingDate));
    cy.contains(`End`)
      .parent(`p`)
      .should(`contain.text`, GeneralFunctionsPage.getDateFormat(endDate));

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
