import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import errorResponse from './fixtures/standard-error-response.json';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

describe('Medications List Page standardize error message', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  beforeEach(() => {
    site.login();
  });
  it('visits Medications List Page standardize error message', () => {
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.visit('/my-health/medications/wrongUrl');
    cy.findByTestId('mhv-page-not-found');
  });
  it('visits Medications Details Page standardize error message', () => {
    const detailsPage = new MedicationsDetailsPage();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.intercept('GET', '/my_health/v1/prescriptions/232323', errorResponse).as(
      'errorResponse',
    );
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.visit('/my-health/medications/prescription/232323');
    detailsPage.verifyResponseForRecordNotFoundForStandardizeErrorMessage();
  });
});
