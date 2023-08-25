import Timeouts from 'platform/testing/e2e/timeouts';

class NextOfKin {
  validatePage = {
    dayOf: () => {
      this.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
    },
    preCheckIn: () => {
      this.validatePageLoaded('Is this your current next of kin?');
    },
  };

  validatePageLoaded = (title = 'Is this your current next of kin?') => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', title);
  };

  validateNextOfKinFields = (parentSelector = '.confirmable-page ul') => {
    cy.get(parentSelector)
      .find('li:nth-of-type(1)')
      .should('include.text', 'Name')
      .next()
      .should('include.text', 'Relationship')
      .next()
      .should('include.text', 'Address')
      .next()
      .should('include.text', 'Phone')
      .next()
      .should('include.text', 'Work phone');
  };

  // @TODO: update to match against mock api.
  validateNextOfKinData = (parentSelector = '.confirmable-page ul') => {
    cy.get(parentSelector)
      .find('li:nth-of-type(1)')
      .should('include.text', 'Johnnie Shaye')
      .next()
      .should('include.text', 'BROTHER')
      .next()
      .should('include.text', '123 Main St, Ste 234Los Angeles, CA 90089')
      .next()
      .should('include.text', '111-222-3333')
      .next()
      .should('include.text', '444-555-6666');
  };

  validateAdditionalInfo = {
    dayOf: () => {
      cy.get('div[data-testid="additional-info"]').should(
        'contain.text',
        'If this isn’t your correct information, select No and a staff member can help you update your information on the day of your appointment.',
      );
    },
    preCheckIn: () => {
      cy.get('div[data-testid="additional-info"]').should(
        'contain.text',
        'If this isn’t your correct information, select No and a staff member can help you update your information on the day of your appointment.',
      );
    },
  };

  validateBackButton = () => {
    cy.get('a[data-testid="back-button"]')
      .should('have.text', 'Back to last screen')
      .should('have.attr', 'href')
      .and('contain', 'emergency-contact');
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`button[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new NextOfKin();
