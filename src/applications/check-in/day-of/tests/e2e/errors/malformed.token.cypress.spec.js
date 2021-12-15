import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Error from '../../../../tests/e2e/pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
    cy.visitWithUUID('MALFORMED_TOKEN');
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5724 - Token is not valid', () => {
    Error.validatePageLoaded();
  });
});
