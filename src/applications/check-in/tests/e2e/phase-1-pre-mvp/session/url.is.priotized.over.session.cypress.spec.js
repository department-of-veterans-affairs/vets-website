import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
    cy.intercept('GET', '/v0/feature_toggles*', createFeatureToggles());
    cy.window().then(window => {
      const sample = JSON.stringify({
        token: 'the-old-id',
      });
      window.sessionStorage.setItem(
        'health.care.check-in.current.uuid',
        sample,
      );
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5757 - Url is prioritized over session data', () => {
    cy.window().then(window => {
      const data = window.sessionStorage.getItem(
        'health.care.check-in.current.uuid',
      );
      const sample = JSON.stringify({
        token: 'the-old-id',
      });
      expect(data).to.equal(sample);
    });
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.get('h1').contains('Your appointment');
    cy.window().then(window => {
      const data = window.sessionStorage.getItem(
        'health.care.check-in.current.uuid',
      );
      const sample = JSON.stringify({
        token: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
      });
      expect(data).to.equal(sample);
    });
  });
});
