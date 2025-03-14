import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Renew Rx Link', () => {
  it('visits Medications List Page Learn How To Renew Prescription Link', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyLearnHowToRenewPrescriptionsLinkExists();
    listPage.verifyLearnHowToRenewPrescriptionsLink();
  });
});
