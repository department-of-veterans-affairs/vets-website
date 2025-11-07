import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Accessibility', () => {
  beforeEach(() => {
    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
  });

  it('has accessible Landing Page', () => {
    cy.visit('/representative');
    cy.injectAxe();
    cy.axeCheck();
  });
  const POA_REQUESTS =
    '/representative/representation-requests?status=pending&sort=created_at_asc';
  it('has accessible POA Requests page', () => {
    cy.visit(POA_REQUESTS);
    cy.injectAxe();
    cy.axeCheck();
  });
});
