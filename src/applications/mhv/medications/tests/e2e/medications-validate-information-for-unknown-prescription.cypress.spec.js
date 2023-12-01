import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Information based on Medication Status', () => {
  it('verify information on list view for unknown prescription status', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    listPage.verifyInformationBasedOnStatusUnknown();
  });
});
