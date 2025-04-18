import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import expiredRxOver180Days from './fixtures/expired-rx-over-180-days-details-page.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Expired Rx Over 180 Days', () => {
  it('visits Medications Details Page ExpiredRx Over 180 Days', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyPrescriptionExpirationDateforRxOver180Days(
      expiredRxOver180Days,
    );
  });
});
