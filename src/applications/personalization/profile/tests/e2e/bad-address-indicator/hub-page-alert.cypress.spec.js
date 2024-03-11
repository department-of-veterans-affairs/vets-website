import { loa3User72, badAddress } from '../../../mocks/endpoints/user';

import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

import BadAddressFeature from './BadAddressFeature';

describe('Bad Address Alert - Profile page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display bad address alert, and navigate to contact info page', () => {
    cy.intercept('GET', '/v0/user', badAddress);
    cy.login(badAddress);
    BadAddressFeature.visitHubPage();
    cy.injectAxeThenAxeCheck();
    BadAddressFeature.confirmPageAlertIsShowing();
    BadAddressFeature.confirmPageAlertLinkNavigatesToContactInformation();
  });
  it('should not show the bad address alert', () => {
    cy.intercept('GET', '/v0/user', loa3User72);
    cy.login(loa3User72);
    BadAddressFeature.visitHubPage();
    cy.injectAxeThenAxeCheck();
    BadAddressFeature.confirmPageAlertIsNotShowing();
  });
});
