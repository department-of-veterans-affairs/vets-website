import features from '../mocks/enabled.json';

import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('happy path', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="no-button"]').click();
    cy.get('h1').contains('Your appointment');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click();
    cy.get('h1').contains('Thank you for checking in');
    cy.injectAxe();
    cy.axeCheck();
  });
});
