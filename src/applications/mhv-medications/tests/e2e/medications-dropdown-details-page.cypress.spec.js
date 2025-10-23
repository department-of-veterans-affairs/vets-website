import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page DropDown', () => {
  it('visits Medications Details Page DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.clickWhatToKnowAboutMedicationsDropDown();
    detailsPage.verifyTextInsideDropDownOnDetailsPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
