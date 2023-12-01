import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Refill Submit Success Message List Page', () => {
  it('visits Success Message on list page', () => {
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
    listPage.clickRefillButton();
    listPage.verifySuccessMessageAfterRefillRequest();
  });
});
