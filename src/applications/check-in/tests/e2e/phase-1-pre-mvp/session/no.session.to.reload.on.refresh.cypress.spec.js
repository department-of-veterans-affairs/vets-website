import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/v0/check.in.responses';
import mockValidate from '../../../../api/local-mock-api/mocks/v0/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
    cy.intercept('GET', '/v0/feature_toggles*', createFeatureToggles());
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });

  it('C5751 - Should show error page since there is no data to load locally', () => {
    const featureRoute = '/health-care/appointment-check-in/update-information';
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visit(featureRoute);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
