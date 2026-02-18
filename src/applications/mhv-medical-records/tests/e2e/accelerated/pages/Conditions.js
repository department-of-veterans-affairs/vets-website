import sessionStatus from '../fixtures/session/default.json';

class Conditions {
  setIntercepts = ({ conditionsData }) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v2/medical_records/conditions*', req => {
      req.reply(conditionsData);
    }).as('conditions-list');
  };

  goToConditionsPage = () => {
    cy.get('[data-testid="conditions-landing-page-link"]').as(
      'conditions-link',
    );
    cy.get('@conditions-link').should('be.visible');
    cy.get('@conditions-link').click();
    cy.wait('@conditions-list');
  };

  verifyConditionsPageTitle = () => {
    // Verify Conditions Page Title
    cy.get('[data-testid="health-conditions"]').should('be.visible');
  };

  clickConditionDetailsLink = (conditionIndex = 0) => {
    cy.findByText(/Showing \d{1,2} to \d{1,2} of \d{1,2} records from/);
    cy.findAllByTestId('record-list-item')
      .eq(conditionIndex)
      .find('a')
      .click();
  };

  // Condition details page verification methods
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
    cy.get('[data-testid="list-item-single"]').contains(providerNote);
  };

  verifyProviderNotesList = providerNote => {
    cy.get('[data-testid="list-item-multiple"]').should('be.visible');
    cy.get('[data-testid="list-item-multiple"]').contains(providerNote);
  };

  viewNextPage = () => {
    cy.get(
      'nav > ul > li.usa-pagination__item.usa-pagination__arrow > a',
    ).click();
  };
}

export default new Conditions();
