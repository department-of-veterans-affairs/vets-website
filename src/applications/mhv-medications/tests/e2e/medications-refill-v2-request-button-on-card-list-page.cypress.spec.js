import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page - V2 (Cerner Pilot) Request Refill Button on Card', () => {
  it('displays Request a refill button on card for refillable prescription - v2', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURLv2(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    listPage.verifyRequestRefillButtonExistsOnCard();
    listPage.verifyRequestRefillButtonText();
    listPage.verifyRequestRefillButtonHasAriaDescribedBy();
  });

  it('does not display Request a refill button for non-refillable prescriptions - v2', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const nonRefillableList = {
      data: rxList.data.filter(rx => !rx.attributes.isRefillable).slice(0, 5),
      meta: rxList.meta,
    };

    site.login();
    listPage.visitMedicationsListPageURLv2(nonRefillableList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyRequestRefillButtonNotExistsOnCard();
  });

  it('shows success alert after successful v2 refill request', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const refillableRx = rxList.data.find(rx => rx.attributes.isRefillable);
    const { prescriptionId, stationNumber } = refillableRx.attributes;

    site.login();
    listPage.visitMedicationsListPageURLv2(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    cy.intercept('POST', '/my_health/v2/prescriptions/refill', req => {
      // Verify the request body contains the prescription ID and stationNumber
      expect(req.body).to.be.an('array');
      expect(req.body).to.have.length(1);
      expect(req.body[0]).to.have.property('id', prescriptionId);
      expect(req.body[0]).to.have.property('stationNumber', stationNumber);

      req.reply({
        statusCode: 200,
        body: { data: { id: prescriptionId, type: 'prescriptions' } },
      });
    }).as('v2RefillRequest');

    listPage.clickRequestRefillButtonOnFirstCard();
    cy.wait('@v2RefillRequest');

    cy.get('[data-testid="success-message"]')
      .should('exist')
      .and('contain', 'We got your refill request');

    cy.get('[data-testid="refill-request-button"]')
      .first()
      .should('have.attr', 'hidden');
  });

  it('shows error alert and keeps button visible after failed v2 refill request', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURLv2(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    cy.intercept('POST', '/my_health/v2/prescriptions/refill', {
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
    }).as('v2RefillRequestError');

    listPage.clickRequestRefillButtonOnFirstCard();
    cy.wait('@v2RefillRequestError');

    cy.get('[data-testid="error-alert"]').should('exist');
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'We couldn’t submit this refill request');

    cy.get('[data-testid="refill-request-button"]')
      .first()
      .should('not.have.attr', 'hidden');
  });
});
