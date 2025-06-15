import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page BackToTop', () => {
  it('visits Medications List Page BackToTop Button', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.scrollTo(0, 1500);
    listPage.clickBackToTopButtonOnListPage();
    listPage.verifyMedicationsListPageTitleIsFocused();
  });
});
