import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Refill Submit Error Message List Page', () => {
  it('visits Error Message on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickRefillButtonForVerifyingError();
    listPage.verifyInlineErrorMessageForRefillRequest();
  });
});
