import { createFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../api/local-mock-api/mocks/v0/check.in.responses';
import mockValidate from '../../../api/local-mock-api/mocks/v0/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      createFeatureToggles(true, false, false, true),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Happy path', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.get('legend > h2').contains('information');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="no-button"]').click();
    cy.get('h1').contains('Your appointment');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click();
    cy.get('va-alert > h1').contains('checked in');
    cy.injectAxe();
    cy.axeCheck();
  });
});
