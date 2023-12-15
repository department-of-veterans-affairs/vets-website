import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionRefillDetails from './fixtures/prescription-refill-button-details-page.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Status DropDown', () => {
  it('visits Medications Details Page Active Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(prescriptionRefillDetails);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyActiveStatusDropDownDefinition();
  });
});
