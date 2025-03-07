import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import nonVARx from './fixtures/non-VA-prescription-on-list-page.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Non VA Prescription ', () => {
  it('visits Medications Active NonVA Rx Details Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 5;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(nonVARx, cardNumber);
    detailsPage.verifyNonVaMedicationStatusOnDetailsPage(nonVARx);
    // detailsPage.verifyNonVAMedicationDisplayMessageOnDetailsPage(nonVARx);
    listPage.verifyPrescriptionSourceForNonVAMedicationOnDetailsPage();
  });
});
