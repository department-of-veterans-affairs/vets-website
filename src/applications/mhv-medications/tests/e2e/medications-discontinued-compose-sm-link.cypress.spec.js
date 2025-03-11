import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications List Page DropDown -- discontinued SM Compose Link', () => {
  it('verifies content of compose message link on discontinued meds', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.get('[data-testid="discontinued-compose-message-link"]')
      .shadow()
      .first()
      .should('have.text', 'Start a new message');
  });
});
