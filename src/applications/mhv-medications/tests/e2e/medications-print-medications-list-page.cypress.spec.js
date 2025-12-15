import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Print List', () => {
  it('visits Print Medications List', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyPrintMedicationsListEnabledOnListPage();
    listPage.verifyPrintThisPageOptionFromDropDownMenuOnListPage();
    cy.window().then(win => {
      cy.stub(win, 'print').as('print');
    });
    cy.get('[data-testid="download-print-button"]').click();
    cy.wait('@exportList');
    cy.get('@print').should('have.been.called');
  });
});
