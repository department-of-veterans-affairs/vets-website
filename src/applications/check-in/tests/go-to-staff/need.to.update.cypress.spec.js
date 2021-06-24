import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- happy path', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
  });
  it('needs to update information', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="yes-button"]').click();
    cy.get('h1').contains('staff member');
    cy.injectAxe();
    cy.axeCheck();
  });
});
