import sessionStatus from '../fixtures/session/default.json';
import mockUumResponse from '../../fixtures/unique-user-metrics-response.json';

class Allergies {
  setIntercepts = ({ allergiesData, useOhData = true } = {}) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');

    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });

    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(allergiesData);
    }).as('allergies-list');
    // Note that we don't need specific event names in the response
    cy.intercept(
      'POST',
      '/my_health/v1/unique_user_metrics',
      mockUumResponse,
    ).as('uum');
  };

  goToAllergiesPage = () => {
    cy.get('[data-testid="allergies-landing-page-link"]')
      .should('be.visible')
      .click();
  };
}

export default new Allergies();
