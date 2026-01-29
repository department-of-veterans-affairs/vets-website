import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import mockUserMedsByMail from './fixtures/user-meds-by-mail.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Meds by Mail content', () => {
  it('shows correct content for non-Meds by Mail users', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.get('[data-testid="meds-by-mail-header"]').should('not.exist');
    cy.get('[data-testid="meds-by-mail-top-level-text"]').should('not.exist');
    cy.get('[data-testid="meds-by-mail-additional-info"]').should('not.exist');
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('shows correct content for Meds by Mail users', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login(true, false, mockUserMedsByMail);
    listPage.visitMedicationsListPageURL(rxList);
    cy.get('[data-testid="meds-by-mail-header"]').should('exist');
    cy.get('[data-testid="meds-by-mail-top-level-text"]').should('exist');
    cy.get('[data-testid="meds-by-mail-additional-info"]').should('exist');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
