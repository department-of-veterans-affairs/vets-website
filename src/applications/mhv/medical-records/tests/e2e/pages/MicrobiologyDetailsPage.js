// import defaultMicrobiology from './fixtures/microbiology.json';

import BaseDetailsPage from './BaseDetailsPage';

class MicrobiologyDetailsPage extends BaseDetailsPage {
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
