import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import { Alerts, Paths } from './utils/constants';
import emptyPrescriptionsList from './fixtures/empty-prescriptions-list.json';

describe('Medications Landing Page Empty Medications List', () => {
  it('visits Alert Message for Empty Medications List', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    cy.intercept('GET', Paths.EMPTY_MED_LIST, emptyPrescriptionsList);
    listPage.visitMedicationsListPageURL(emptyPrescriptionsList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyEmptyMedicationsListAlertOnListPage(Alerts.EMPTY_MED_LIST);
  });
});
