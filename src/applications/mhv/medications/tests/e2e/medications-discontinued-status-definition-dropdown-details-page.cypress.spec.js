import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import discontinuedRx from './fixtures/discontinued-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Discontinued Status DropDown', () => {
  it('visits Medications Details Page Discontinued Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(discontinuedRx);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyDiscontinuedStatusDropDownDefinition();
  });
});
