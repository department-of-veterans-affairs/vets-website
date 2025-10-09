import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Print List', () => {
  it('validates keyboard navigation for Print Medications List', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.tabToElement('[data-testid="print-records-button"]');
    cy.get('[data-testid="print-records-button"]')
      .focus()
      .should('have.focus');
    cy.realPress('Enter');
    cy.get('[data-testid="download-print-button"]').should('be.visible');
    cy.realPress('ArrowDown');
    cy.get('[data-testid="download-print-button"]').should('have.focus');
    cy.window().then(win => {
      cy.stub(win, 'print').as('print');
    });
    cy.realPress('Enter');
    cy.wait('@exportList');
    cy.get('@print').should('have.been.called');
  });
});
