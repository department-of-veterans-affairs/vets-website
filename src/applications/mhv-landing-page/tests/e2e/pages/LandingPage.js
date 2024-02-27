import { generateUser } from '../../../mocks/api/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  validatePageLoaded = () =>
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;

  validateURL = () => cy.url().should('match', /my-health/);

  visitPage = ({ serviceProvider = 'idme', facilities, loa = 3 } = {}) => {
    cy.login(generateUser({ serviceProvider, facilities, loa }));
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
