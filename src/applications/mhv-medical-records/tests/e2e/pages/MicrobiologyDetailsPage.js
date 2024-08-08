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

  verifyLabLocation = labLocation => {
    cy.get('[data-testid="microbio-lab-location"]').should(
      'contain',
      labLocation,
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
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');
    cy.get('[data-testid="compose-message-Link"]')
      .contains(composeMessageLink)
      .invoke('attr', 'href')
      .should('contain', 'myhealth.va.gov/mhv-portal-web/compose-message');
    // https://mhv-syst.myhealth.va.gov/mhv-portal-web/compose-message
  };
}

export default new MicrobiologyDetailsPage();
