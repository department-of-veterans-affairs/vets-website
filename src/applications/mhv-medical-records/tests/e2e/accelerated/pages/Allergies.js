import sessionStatus from '../fixtures/session/default.json';
import vamc from '../../fixtures/facilities/vamc-ehr.json';

class Allergies {
  setIntercepts = ({ allergiesData, useOhData = true } = {}) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');

    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });

    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamc).as('vamcEhr');

    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(allergiesData);
    }).as('allergies-list');

    cy.intercept('GET', '/my_health/v2/medical_records/allergies*', req => {
      req.reply(allergiesData);
    }).as('allergies-list');
  };

  goToAllergiesPage = () => {
    cy.findByTestId('allergies-landing-page-link').click();
  };
}

export default new Allergies();
