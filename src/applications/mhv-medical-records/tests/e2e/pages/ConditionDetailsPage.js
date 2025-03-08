// import defaultCondition from '../fixtures/Condition.json';
import BaseDetailsPage from './BaseDetailsPage';

class ConditionDetailsPage extends BaseDetailsPage {
  verifyTitle = title => {
    cy.get('h1').should('contain', title);
  };

  verifyProvider = provider => {
    cy.get('[data-testid="condition-provider"]').should('be.visible');
    cy.get('[data-testid="condition-provider"]').contains(provider);
  };

  verifyLocation = location => {
    cy.get('[data-testid="condition-location"]').should('be.visible');
    cy.get('[data-testid="condition-location"]').contains(location);
  };

  verifyProviderNotes = providerNote => {
    // cy.get('[data-testid="item-list-string"]').should('be.visible');
    cy.get('[data-testid="list-item-single"]').contains(providerNote);
  };

  verifyProviderNotesList = providerNote => {
    cy.get('[data-testid="list-item-multiple"]').should('be.visible');
    cy.get('[data-testid="list-item-multiple"]').contains(providerNote);
  };
}

export default new ConditionDetailsPage();
