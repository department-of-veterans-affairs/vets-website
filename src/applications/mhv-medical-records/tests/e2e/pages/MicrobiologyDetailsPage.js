// import defaultMicrobiology from './fixtures/microbiology.json';

import BaseDetailsPage from './BaseDetailsPage';

class MicrobiologyDetailsPage extends BaseDetailsPage {
  verifyLabName = name => {
    cy.get('[data-testid="microbio-name"]').should('contain', name);
  };

  verifyLabDate = date => {
    cy.get('[data-testid="header-time"]').should('contain', date);
  };

  verifySampleTested = sampleTested => {
    cy.get('[data-testid="microbio-sample-tested"]').should(
      'contain',
      sampleTested,
    );
  };

  verifySampleFrom = sampleFrom => {
    cy.get('[data-testid="microbio-sample-from"]').should(
      'contain',
      sampleFrom,
    );
  };

  verifyOrderedBy = orderedBy => {
    cy.get('[data-testid="microbio-ordered-by"]').should('contain', orderedBy);
  };

  verifyOrderingLocation = orderingLocation => {
    cy.get('[data-testid="microbio-ordering-location"]').should(
      'contain',
      orderingLocation,
    );
  };

  verifyCollectingLocation = collectingLocation => {
    cy.get('[data-testid="microbio-collecting-location"]').should(
      'contain',
      collectingLocation,
    );
  };

  verifyDateCompleted = dateCompleted => {
    cy.get('[data-testid="microbio-date-completed"]').should(
      'contain',
      dateCompleted,
    );
  };

  verifyComposeMessageLink = composeMessageLink => {
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="new-message-link"]').should('be.visible');
    cy.get('[data-testid="new-message-link"]')
      .contains(composeMessageLink)
      .invoke('attr', 'href')
      .should('contain', '/my-health/secure-messages/new-message');
  };
}

export default new MicrobiologyDetailsPage();
