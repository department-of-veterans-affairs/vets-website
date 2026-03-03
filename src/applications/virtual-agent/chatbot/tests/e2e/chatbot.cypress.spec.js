import manifest from '../../../manifest.json';
import { mockFeatureToggles } from './helpers/chatbot-helpers';

describe('VA Virtual Agent Chatbot', () => {
  beforeEach(() => {
    mockFeatureToggles();
  });

  it('renders the chatbot application', () => {
    cy.visit(manifest.rootUrl);
    cy.wait('@mockFeatures');

    // Verify the page loads with expected content
    // Update selector as the chatbot component develops
    cy.findByTestId('chatbox-container').should('be.visible');

    // Verify AI disclaimer is visible
    cy.contains(
      'We may use artificial intelligence (AI) for these responses',
    ).should('be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
