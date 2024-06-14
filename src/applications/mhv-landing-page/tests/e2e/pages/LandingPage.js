import { generateUser } from '../../../mocks/api/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  validatePageLoaded = () =>
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;

  loaded = () => this.validatePageLoaded();

  secondaryNav = () => cy.findByRole('navigation', { name: 'My HealtheVet' });

  secondaryNavRendered = () => this.secondaryNav().should.exist;

  validateURL = () => cy.url().should('match', /\/my-health\/$/);

  visitPage = ({
    verified = true,
    registered = true,
    mhvAccountState = 'OK',
  } = {}) => {
    let props = { mhvAccountState };
    if (!verified) props = { ...props, loa: 1 };
    if (!registered) props = { ...props, vaPatient: false };
    const user = generateUser(props);
    cy.login(user);
    cy.visit(this.pageUrl);
    this.loaded();
    this.validateURL();
  };

  visit = props => this.visitPage(props);

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
