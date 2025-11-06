import sessionStatus from '../fixtures/session/default.json';
import vamc from '../../fixtures/facilities/vamc-ehr.json';

class AllergiesIntercepts {
  // Base intercepts needed for all tests
  setupBaseIntercepts = () => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamc).as('vamcEhr');
  };

  // Path 1: v2 SCDF endpoint
  setupV2Intercepts = allergiesData => {
    this.setupBaseIntercepts();
    cy.intercept('GET', '/my_health/v2/medical_records/allergies*', req => {
      req.reply(allergiesData);
    }).as('allergies-list');
  };

  // Path 2: v1 Oracle Health endpoint
  setupOracleHealthIntercepts = allergiesData => {
    this.setupBaseIntercepts();
    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      expect(req.url).to.contain('use_oh_data_path=1');
      req.reply(allergiesData);
    }).as('allergies-list');
  };

  // Path 3: v1 VistA endpoint
  setupVistaIntercepts = allergiesData => {
    this.setupBaseIntercepts();
    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(allergiesData);
    }).as('allergies-list');
  };

  blockV1Endpoint = () => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies/*', () => {
      throw new Error(
        'Should not call v1 endpoint when acceleration is enabled',
      );
    });
  };
}

export default new AllergiesIntercepts();
