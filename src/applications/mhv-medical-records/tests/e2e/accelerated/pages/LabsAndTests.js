import sessionStatus from '../fixtures/session/default.json';

class LabsAndTests {
  setIntercepts = ({ labsAndTestData, useOhData = true }) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v2/medical_records/labs*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('start_date=');
        expect(req.url).to.contain('end_date=');
      }
      req.reply(labsAndTestData);
    }).as('labs-and-test-list');
  };

  checkLandingPageLinks = () => {
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').should(
      'be.visible',
    );
  };

  goToLabAndTestPage = () => {
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').click({
      waitForAnimations: true,
    });
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

  selectLabAndTest = ({ labName }) => {
    cy.contains(labName).click({ waitForAnimations: true });
    cy.get('[data-testid="lab-name"]').should('be.visible');
    cy.get('[data-testid="lab-name"]').contains(labName);
  };
}

export default new LabsAndTests();
