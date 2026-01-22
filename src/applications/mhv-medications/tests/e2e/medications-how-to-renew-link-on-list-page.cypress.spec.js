import MedicationsSite from './med_site/MedicationsSite';
import oracleHealthRxList from './fixtures/oracle-health-prescriptions.json';
import cernerUser from './fixtures/cerner-user.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Renew Rx Link', () => {
  it('visits Medications List Page Renewal Request Message Link', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    // Use Cerner user to enable Oracle Health features
    site.login(true, false, cernerUser);
    listPage.visitMedicationsListPageURL(oracleHealthRxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyLearnHowToRenewPrescriptionsLinkExists();
    listPage.verifyLearnHowToRenewPrescriptionsLink();
  });
});
