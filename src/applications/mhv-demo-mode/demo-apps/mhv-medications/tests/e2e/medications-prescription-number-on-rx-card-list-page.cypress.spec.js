import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionsDetails from './fixtures/prescription-details.json';

describe('Medications Prescription Number On Card On List Page', () => {
  it('visits Medications Rx Number On Medication Card On List Page ', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyPrescriptionNumberIsVisibleOnRxCardOnListPage(
      prescriptionsDetails.data.attributes.prescriptionNumber,
    );
  });
});
