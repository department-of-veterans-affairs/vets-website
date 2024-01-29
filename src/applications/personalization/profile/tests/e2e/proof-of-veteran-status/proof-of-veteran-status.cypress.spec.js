import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';

import { PROFILE_PATHS } from '@@profile/constants';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';
import { loa3User72 } from '../../../mocks/endpoints/user';

describe('Proof of Veteran status', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowProofOfVeteranStatus: true,
      }),
    );
    cy.login(loa3User72);
    cy.intercept('GET', '/v0/user', loa3User72);
    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/service_history', serviceHistory);
  });

  it('Should display the Proof of Veteran Status component', () => {
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();

    cy.findByText(/Proof of Veteran status/).should('exist');
  });
});

describe('Veteran is not eligible', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowProofOfVeteranStatus: true,
      }),
    );
    cy.login(loa3User72);
    cy.intercept('GET', '/v0/user', loa3User72);
    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/service_history', serviceHistory.none);
  });
  it('should not display the Veteran Status download component', () => {
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    cy.findByText(/Proof of Veteran status/).should('not.exist');
  });
});
