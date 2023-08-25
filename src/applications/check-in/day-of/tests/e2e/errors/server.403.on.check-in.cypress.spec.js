import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();

    initializeCheckInDataGet.withFailure(403);
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visitWithUUID();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5728 - Check in - 404 api error', () => {
    Error.validateURL();
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
