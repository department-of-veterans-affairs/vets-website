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
    cy.findByRole('heading', { name: 'V2 Chatbot Placeholder' }).should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
