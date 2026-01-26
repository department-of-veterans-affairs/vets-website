import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import refillablePrescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications List Page - Request Refill Button on Card', () => {
  it('displays Request a refill button on card for refillable prescription', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    listPage.verifyRequestRefillButtonExistsOnCard();
    listPage.verifyRequestRefillButtonText();
    listPage.verifyRequestRefillButtonHasAriaDescribedBy();
  });

  it('does not display Request a refill button for non-refillable prescriptions', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const nonRefillableList = {
      data: rxList.data.filter(rx => !rx.attributes.isRefillable).slice(0, 5),
      meta: rxList.meta,
    };

    site.login();
    listPage.visitMedicationsListPageURL(nonRefillableList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyRequestRefillButtonNotExistsOnCard();
  });

  it('navigates to refill page when clicking Request a refill button', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const refillPage = new MedicationsRefillPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/list_refillable_prescriptions',
      refillablePrescriptions,
    ).as('refillList');

    listPage.clickRequestRefillButtonOnFirstCard();
    cy.url().should('include', '/refill');
    cy.wait('@refillList');
    refillPage.verifyRefillPageTitle();
  });
});
