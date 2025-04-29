import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Accessibility', () => {
  beforeEach(() => {
    setFeatureToggles({
      isAppEnabled: true,
      isInPilot: true,
    });
  });

  it('has accessible 21a form intro', () => {
    cy.visit('/representative/accreditation/attorney-claims-agent-form-21a');
    cy.injectAxe();
    cy.axeCheck();
  });
});
