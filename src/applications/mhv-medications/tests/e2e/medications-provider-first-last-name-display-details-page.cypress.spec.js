import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import nonVARx from './fixtures/non-VA-prescription-on-list-page.json';
import rxList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Provider Name', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  const detailsPage = new MedicationsDetailsPage();
  beforeEach(() => {
    site.login();
  });
  it('visits Medications Details Page Provider First Last Name', () => {
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.verifyProviderFirstLastNameOnDetailsPage(
      Data.PROVIDER_FULL_NAME,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('verify information on list view for non-VA prescriptions', () => {
    listPage.visitMedicationsListPageURL(rxList);
    const cardNumber = 5;
    listPage.verifyInformationBasedOnStatusNonVAPrescription(
      Data.ACTIVE_NON_VA,
    );
    detailsPage.clickMedicationDetailsLink(nonVARx, cardNumber);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.verifyDocumentedByFullNameOnNonVAMedicationDetailsPage(
      Data.DOCUMENTED_BY_FULL_NAME,
    );
  });
});
