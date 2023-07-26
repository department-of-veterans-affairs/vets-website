import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    cy.visit('my-health/medications/');
    site.login();
    cy.get('[href="/my-health/medications/prescriptions"]').click({
      force: true,
    });
    cy.contains('What to know about downloading records').click({
      force: true,
    });
    listPage.verifyTextInsideDropDownOnListPage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
