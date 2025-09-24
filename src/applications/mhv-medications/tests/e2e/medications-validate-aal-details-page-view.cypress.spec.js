import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import aalRequestBody from './fixtures/aal-request-body.json';
import { Paths } from './utils/constants';

describe('Medications Details Page AAL API Call', () => {
  it('visits Medications Details Page AAL API Call', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.intercept('POST', `${Paths.INTERCEPT.AAL}`, aalRequestBody).as(
      'aalRequest',
    );
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.wait('@aalRequest').then(interception => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.equal(200);
      const requestBody = interception.request.body;
      expect(requestBody).to.have.property('aal');
      expect(requestBody).to.deep.equal({
        aal: {
          action: 'View Medication Detail Page',
          activityType: 'RxRefill',
          detailValue: 'RX #: 2720554 RX Name: MELOXICAM 15MG TAB',
          performerType: 'Self',
          status: '1',
        },
        product: 'rx',
        oncePerSession: true,
      });
    });
    detailsPage.clickMedicationsListPageBreadcrumbsOnDetailsPage();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.get('@aalRequest.all').should('have.length', 1);
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
