import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Header on mobile', () => {
  beforeEach(() => {
    cy.viewport(760, 1024);

    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
    cy.visit('/representative');

    cy.injectAxe();
  });

  it('allows navigating from the Landing Page to unified sign-in page', () => {
    cy.axeCheck();

    cy.get('[data-testid=user-nav-mobile-sign-in-link]')
      .contains('Sign in')
      .click();
    cy.location('pathname').should('eq', '/sign-in/');
  });

  it('allows navigation from the Landing Page to the POA Requests Page then use the logo link to navigate back to the Landing Page', () => {
    cy.axeCheck();

    cy.get('[data-testid=landing-page-heading]').should(
      'have.text',
      'Welcome to the Accredited Representative Portal',
    );
    cy.get('[data-testid=landing-page-bypass-sign-in-link]').click();

    cy.location('pathname').should('eq', '/representative/poa-requests');
    cy.axeCheck();

    cy.get('[data-testid=poa-requests-heading]').should(
      'have.text',
      'Power of attorney requests',
    );

    cy.get('[data-testid=mobile-logo-row-logo-link]').click();
    cy.get('[data-testid=landing-page-heading]').should(
      'have.text',
      'Welcome to the Accredited Representative Portal',
    );
  });
});

describe('Header on screens wider than mobile', () => {
  beforeEach(() => {
    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
    cy.visit('/representative');

    cy.injectAxe();
  });

  it('allows navigating from the Landing Page to unified sign-in page', () => {
    cy.axeCheck();

    cy.get('[data-testid=user-nav-wider-than-mobile-sign-in-link]')
      .contains('Sign in')
      .click();
    cy.location('pathname').should('eq', '/sign-in/');
  });

  it('allows navigation from the Landing Page to the POA Requests Page and then use the logo link to navigate back to the Landing Page', () => {
    cy.axeCheck();

    cy.get('[data-testid=landing-page-heading]').should(
      'have.text',
      'Welcome to the Accredited Representative Portal',
    );
    cy.get('[data-testid=wider-than-mobile-menu-poa-link]').click();

    cy.location('pathname').should('eq', '/representative/poa-requests');
    cy.axeCheck();

    cy.get('[data-testid=poa-requests-heading]').should(
      'have.text',
      'Power of attorney requests',
    );

    cy.get('[data-testid=wider-than-mobile-logo-row-logo-link]').click();
    cy.get('[data-testid=landing-page-heading]').should(
      'have.text',
      'Welcome to the Accredited Representative Portal',
    );
  });

  it('allows navigation from the Dashboard to the POA Requests Page via the Header Menu', () => {
    cy.axeCheck();

    cy.get('[data-testid=landing-page-heading]').should(
      'have.text',
      'Welcome to the Accredited Representative Portal',
    );
    cy.get('[data-testid=wider-than-mobile-menu-poa-link]').click();

    cy.location('pathname').should('eq', '/representative/poa-requests');
    cy.axeCheck();

    cy.get('[data-testid=poa-requests-heading]').should(
      'have.text',
      'Power of attorney requests',
    );
    cy.get('[data-testid=poa-requests-table]').should('exist');
  });
});
