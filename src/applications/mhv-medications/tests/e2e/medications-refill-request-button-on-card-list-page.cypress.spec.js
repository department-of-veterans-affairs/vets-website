import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

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

  it('shows success alert after successful refill request', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const refillableRx = rxList.data.find(rx => rx.attributes.isRefillable);
    const prescriptionId = refillableRx?.attributes?.prescriptionId;

    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/${prescriptionId}/refill`,
      {
        statusCode: 200,
        body: { data: { id: prescriptionId, type: 'prescriptions' } },
      },
    ).as('refillRequest');

    listPage.clickRequestRefillButtonOnFirstCard();
    cy.wait('@refillRequest');

    cy.get('[data-testid="success-message"]')
      .should('exist')
      .and('contain', 'We got your refill request');

    cy.get('[data-testid="refill-request-button"]')
      .first()
      .should('have.attr', 'hidden');
  });

  it('shows error alert and keeps button visible after failed refill request', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const refillableRx = rxList.data.find(rx => rx.attributes.isRefillable);
    const prescriptionId = refillableRx?.attributes?.prescriptionId;

    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/${prescriptionId}/refill`,
      {
        statusCode: 500,
        body: {
          errors: [
            {
              status: '500',
              title: 'Failed to refill prescription',
              detail: 'An error occurred while processing your refill request.',
            },
          ],
        },
      },
    ).as('refillRequestError');

    listPage.clickRequestRefillButtonOnFirstCard();
    cy.wait('@refillRequestError');

    cy.get('[data-testid="error-alert"]').should('exist');
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'We couldn’t submit this refill request');

    cy.get('[data-testid="refill-request-button"]')
      .first()
      .should('not.have.attr', 'hidden');
  });

  it('does not display Request a refill button when refill was submitted within 15 days', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const recentSubmitDate = new Date().toISOString();
    const recentlySubmittedList = {
      data: rxList.data.map(rx => ({
        ...rx,
        attributes: {
          ...rx.attributes,
          refillSubmitDate: rx.attributes.isRefillable
            ? recentSubmitDate
            : null,
        },
      })),
      meta: rxList.meta,
    };

    site.login();
    listPage.visitMedicationsListPageURL(recentlySubmittedList);
    cy.injectAxe();
    cy.axeCheck('main');

    listPage.verifyRequestRefillButtonNotExistsOnCard();
  });
});
