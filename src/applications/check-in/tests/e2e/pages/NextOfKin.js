/* eslint-disable @department-of-veterans-affairs/use-workspace-imports */
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
      cy.get('[data-testid="additional-info"] div').should(
        'have.css',
        'visibility',
        'hidden',
      );
      this.openAdditionalInfo();
      cy.get('[data-testid="additional-info"] div')
        .should('have.css', 'visibility', 'visible')
        .and('have.css', 'display', 'block');
      cy.get('[data-testid="additional-info"]').should(
        'contain.text',
        'If this is not your correct information, select No and a staff member can help you check in and update your information.',
      );
    },
    preCheckIn: () => {
      cy.get('[data-testid="additional-info"] div').should(
        'have.css',
        'visibility',
        'hidden',
      );
      this.openAdditionalInfo();
      cy.get('[data-testid="additional-info"] div')
        .should('have.css', 'visibility', 'visible')
        .and('have.css', 'display', 'block');
      cy.get('[data-testid="additional-info"]').should(
        'contain.text',
        'If this is not your correct information, select No. A staff member will help you update your next of kin information on the day of your appointment.',
      );
    },
  };

  validateHelpText = () => {
    cy.get('[data-testid="help-text"] div').should(
      'have.css',
      'visibility',
      'hidden',
    );
    this.openHelpText();
    cy.get('[data-testid="help-text"] div')
      .should('have.css', 'visibility', 'visible')
      .and('have.css', 'display', 'block');
    cy.get('[data-testid="help-text"]').should(
      'contain.text',
      "Confirm who you'd like to represent your wishes for care, medical documentation, and benefits if needed. Your next of kin is often your closest living relative, like your spouse, child, parent, or sibling.",
    );
  };

  validateBackButton = () => {
    cy.get('a[data-testid="back-button"]')
      .should('have.text', 'Back to last screen')
      .should('have.attr', 'href')
      .and('contain', 'emergency-contact');
  };

  openAdditionalInfo = () => {
    cy.get('[data-testid="additional-info"]')
      .shadow()
      .find('.additional-info-title')
      .click({
        waitForAnimations: true,
      });
  };

  openHelpText = () => {
    cy.get('[data-testid="help-text"]')
      .shadow()
      .find('.additional-info-title')
      .click({
        waitForAnimations: true,
      });
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new NextOfKin();
