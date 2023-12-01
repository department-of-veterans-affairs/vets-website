import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

describe('Navigate to Print DropDown on Details Page', () => {
  it.skip('verify print dropdown on medications details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    cy.visit('my-health/about-medications/');
    site.login();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    detailsPage.clickPrintOrDownloadThisPageDropDownOnDetailsPage();
    detailsPage.verifyPrintButtonEnabledOnDetailsPage();
  });
});
