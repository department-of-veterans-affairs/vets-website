import unverifiedUser from '../../fixtures/user.loa1.json';
import unregisteredUser from '../../fixtures/user.unregistered.json';
import user from '../../fixtures/user.json';
import userData from '../../../mocks/api/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  validatePageLoaded = () =>
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;

  validateURL = () => cy.url().should('match', /my-health/);

  visitPage = ({
    unverified = false,
    unregistered = false,
    mhvAccountState = false,
  } = {}) => {
    if (unverified) {
      cy.login(unverifiedUser);
    } else if (unregistered) {
      cy.login(unregisteredUser);
    } else if (mhvAccountState) {
      cy.login(userData.generateUserWithMHVAccountState(mhvAccountState));
    } else {
      cy.login(user);
    }
    cy.visit(this.pageUrl);
  };

  /**
   * Validate a card has a heading and the correct number of links in it.
   * @param {*} cardHeadline a string with the title of a card
   * @param {*} numLinks the number of links in the card
   */
  validateLinkGroup = (cardHeadline, numLinks) => {
    // Find the spotlight section and look for the links
    cy.findByRole('heading', { name: cardHeadline }).should('exist');
    cy.findByRole('heading', { name: cardHeadline })
      .parents('[data-testid^="mhv-link-group"]')
      .should('have.length', 1)
      .find('a')
      .should('have.length', numLinks)
      .each($link => {
        // Check the links have text and an href
        cy.wrap($link)
          .invoke('text')
          .should('have.length.gt', 0);
        cy.wrap($link)
          .should('have.attr', 'href')
          .should('not.be.empty');
      });
  };
}

export default new LandingPage();
