import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import emptyFieldRx from './fixtures/empty-field-prescription-details.json';
import { Data } from './utils/constants';
import medicationsList from './fixtures/grouped-prescriptions-list.json';

describe('Medications Details Page RX Quantity', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  const detailsPage = new MedicationsDetailsPage();
  beforeEach(() => {
    site.login();
  });

  it('visits Medications Details Page RX Quantity', () => {
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.verifyPrescriptionQuantityOnDetailsPage(
      mockPrescriptionDetails.data.attributes.quantity,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('visits Medications Details Page RX Quantity Empty', () => {
    listPage.visitMedicationsListPageURL(medicationsList);
    detailsPage.clickMedicationDetailsLink(emptyFieldRx, 5);
    detailsPage.verifyQuantityNotAvailableOnDetailsPage(Data.QUANTITY_EMPTY);
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
