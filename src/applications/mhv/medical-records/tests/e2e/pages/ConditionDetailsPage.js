// import defaultCondition from '../fixtures/Condition.json';
import BaseDetailsPage from './BaseDetailsPage';

class ConditionDetailsPage extends BaseDetailsPage {
  verifyProvider = provider => {
    cy.get('[data-testid="condition-provider"]').should('be.visible');
    cy.get('[data-testid="condition-provider"]').contains(provider);
  };

  verifyLocation = location => {
    cy.get('[data-testid="condition-location"]').should('be.visible');
    cy.get('[data-testid="condition-location"]').contains(location);
  };

  verifyProviderNotes = providerNotes => {
    // cy.get('[data-testid="item-list-string"]').should('be.visible');
    cy.get('[data-testid="list-item-single"]').contains(providerNotes);
  };
}

export default new ConditionDetailsPage();
