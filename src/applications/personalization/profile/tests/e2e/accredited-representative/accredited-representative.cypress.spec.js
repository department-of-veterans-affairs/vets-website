import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import { PROFILE_PATHS } from '@@profile/constants';
import { loa3User72 } from '@@profile/mocks/endpoints/user';

describe('Accredited representative -- feature disabled', () => {
  it('removes the link from the nav', () => {
    const featureToggles = generateFeatureToggles({
      representativeStatusEnableV2Features: false,
    });
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('h1');
    cy.get('a[href$="/profile/accredited-representative"]').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
