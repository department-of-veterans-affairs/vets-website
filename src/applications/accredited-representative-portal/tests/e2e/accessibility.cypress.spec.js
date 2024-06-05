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

  it('has accessible POA Requests page', () => {
    cy.visit('/representative/poa-requests');
    cy.injectAxe();
    cy.axeCheck();
  });
});
