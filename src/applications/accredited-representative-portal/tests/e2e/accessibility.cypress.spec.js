import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Accessibility', () => {
  beforeEach(() => {
    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
  });

  it('has accessible 21a form intro', () => {
    cy.visit('/representative');
    cy.injectAxe();
    cy.axeCheck();
  });
});
