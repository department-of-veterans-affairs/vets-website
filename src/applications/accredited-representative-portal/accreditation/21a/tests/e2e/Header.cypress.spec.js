import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Header on mobile', () => {
  beforeEach(() => {
    cy.viewport(760, 1024);

    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
    cy.visit('/representative/accreditation/attorney-claims-agent-form-21a');

    cy.injectAxe();
  });

  it('allows navigating from the 21a form intro to unified sign-in page', () => {
    cy.axeCheck();

    cy.get('[data-testid=user-nav-mobile-sign-in-link]')
      .contains('Sign in')
      .click();
    cy.location('pathname').should('eq', '/sign-in/');
  });
});

describe('Header on screens wider than mobile', () => {
  beforeEach(() => {
    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
    cy.visit('/representative/accreditation/attorney-claims-agent-form-21a');

    cy.injectAxe();
  });

  it('allows navigating from the 21a form intro to unified sign-in page', () => {
    cy.axeCheck();

    cy.get('[data-testid=user-nav-wider-than-mobile-sign-in-link]')
      .contains('Sign in')
      .click();
    cy.location('pathname').should('eq', '/sign-in/');
  });
});
