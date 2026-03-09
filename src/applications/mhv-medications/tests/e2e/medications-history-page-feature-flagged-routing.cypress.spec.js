import MedicationsSite from './med_site/MedicationsSite';
import MedicationsHistoryPage from './pages/MedicationsHistoryPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medication History page', () => {
  const site = new MedicationsSite();

  beforeEach(() => {
    site.login();
  });

  it('renders page not found when feature flag is false', () => {
    const historyPage = new MedicationsHistoryPage();

    historyPage.visitPage();
    cy.findByTestId('mhv-page-not-found');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the medication history page when feature flag is true', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_medications_management_improvements',
            value: true,
          },
        ],
      },
    }).as('featureToggles');

    const historyPage = new MedicationsHistoryPage();

    historyPage.visitPage();
    historyPage.verifyHeading();
    cy.injectAxeThenAxeCheck();
  });

  it('displays navigation links, medications list, and sort dropdown', () => {
    const historyPage = new MedicationsHistoryPage();
    site.loginWithManagementImprovements();
    historyPage.visitPageWithPrescriptions(rxList);
    historyPage.verifyHeading();
    historyPage.verifyInProgressLink();
    historyPage.verifyRefillLink();
    historyPage.verifyMedicationsListVisible();
    historyPage.verifySortDropdownVisible();
    historyPage.verifyMedicationCardVisible();
    historyPage.verifyPageTotalInfo(1, 10, 29);
    cy.injectAxeThenAxeCheck();
  });

  it('displays Need Help section with management improvements links', () => {
    const historyPage = new MedicationsHistoryPage();
    site.loginWithManagementImprovements();
    historyPage.visitPageWithPrescriptions(rxList);
    historyPage.verifyNeedHelpSection();
    historyPage.verifyNeedHelpAllergiesLink();
    historyPage.verifyNeedHelpMessageLink();
    historyPage.verifyNeedHelpNotificationSettingsLink();
    cy.injectAxeThenAxeCheck();
  });

  it('displays error notification when prescriptions API fails', () => {
    const historyPage = new MedicationsHistoryPage();
    site.loginWithManagementImprovements();
    historyPage.visitPageWithApiError();
    historyPage.verifyHeading();
    historyPage.verifyApiErrorNotification();
    cy.injectAxeThenAxeCheck();
  });

  it('displays empty list message when no medications exist', () => {
    const historyPage = new MedicationsHistoryPage();
    site.loginWithManagementImprovements();
    historyPage.visitPageWithEmptyList();
    historyPage.verifyHeading();
    historyPage.verifyEmptyListMessage();
    cy.injectAxeThenAxeCheck();
  });
});
