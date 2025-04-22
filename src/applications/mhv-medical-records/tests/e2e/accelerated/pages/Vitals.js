import sessionStatus from '../fixtures/session/default.json';

class Vitals {
  setIntercepts = ({ vitalData, useOhData = true }) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
        expect(req.url).to.contain('from=');
        expect(req.url).to.contain('to=');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(vitalData);
    }).as('vitals-list');
  };

  goToVitalPage = () => {
    cy.get('[data-testid="vitals-landing-page-link"]').as('vitals-link');
    cy.get('@vitals-link').should('be.visible');
    cy.get('@vitals-link').click();
  };

  checkUrl = ({ timeFrame }) => {
    cy.url().should('include', `?timeFrame=${timeFrame}`);
  };

  selectMonthAndYear = ({ month, year, submit = true }) => {
    cy.get('select[name="vitals-date-pickerMonth"]').select(month);
    cy.get('input[name="vitals-date-pickerYear"]').clear();
    cy.get('input[name="vitals-date-pickerYear"]').type(year);
    if (submit) {
      cy.get('[data-testid="update-time-frame-button"]').click({
        waitForAnimations: true,
      });
    }
  };

  verifySelectedDate = ({ dateString }) => {
    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").contains(dateString);
  };

  viewNextPage = () => {
    cy.get(
      'nav > ul > li.usa-pagination__item.usa-pagination__arrow > a',
    ).click();
  };
}

export default new Vitals();
