import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import Error from './pages/Error';

describe('A patient that visits a url with a UUID that is not found', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withFailure(404);
    cy.visitTravelClaimWithUUID();
  });
  it('should display the error page', () => {
    Error.validatePageLoaded();
    Error.validateErrorAlert('uuid-not-found');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--error-uuid-not-found');
  });
});
