import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Header', () => {
  beforeEach(() => {
    setFeatureToggles({
      isAppEnabled: true,
      isForm21Enabled: true,
      isInPilot: true,
      accreditedRepresentativePortalFrontend: true,
      accreditedRepresentativePortalForm21a: true,
    });
    cy.visit('/representative/accreditation/attorney-claims-agent-form-21a');

    cy.injectAxe();
  });

  it('allows navigating from the 21a form intro to unified sign-in page', () => {
    cy.axeCheck();

    cy.get('[data-testid=user-nav-sign-in-link]')
      .contains('Sign in')
      .click();
    cy.location('pathname').should('eq', '/sign-in/');
  });
});
