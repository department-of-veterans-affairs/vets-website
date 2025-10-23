import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';

describe('Medications List Page Information based on Medication Status', () => {
  it('verify information on list view for unknown prescription status', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyInformationBasedOnStatusUnknown(
      unknownRx.data.attributes.prescriptionId,
    );
  });
});
