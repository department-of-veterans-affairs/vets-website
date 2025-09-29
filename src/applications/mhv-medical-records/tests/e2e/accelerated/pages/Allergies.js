import sessionStatus from '../fixtures/session/default.json';
import MedicalRecordsLandingPage from '../../pages/MedicalRecordsLandingPage';
import vamc from '../../fixtures/facilities/vamc-ehr.json';

class Allergies {
  setIntercepts = ({ allergiesData } = {}) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');

    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });

    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamc).as('vamcEhr');

    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      req.reply(allergiesData);
    }).as('allergies-list');

    cy.intercept('GET', '/my_health/v2/medical_records/allergies*', req => {
      req.reply(allergiesData);
    }).as('allergies-list');

    MedicalRecordsLandingPage.uumIntercept();
  };

  goToAllergiesPage = () => {
    cy.findByTestId('allergies-landing-page-link').click();
  };
}

export default new Allergies();
