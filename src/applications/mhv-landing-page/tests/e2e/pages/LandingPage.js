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

  validateHealthToolsLinksEnabled = () => {
    cy.findByText(/Welcome to the new home for My HealtheVet/i).should('exist');
    cy.findByText(
      /Now you can manage your health care needs in the same place/i,
    ).should('exist');
    cy.findByText(/If you're not ready to try the new My HealtheVet/i).should(
      'exist',
    );
  };

  validateHealthToolsLinksDisabled = () => {
    cy.findByText(/Learn more about My HealtheVet on VA.gov/i).should('exist');
    cy.findByText(
      /where you can manage your VA health care and your health/i,
    ).should('exist');
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

describe('My HealtheVet Landing Page', () => {
  const landingPage = new LandingPage();

  context('when mhvLandingPageEnableVaGovHealthToolsLinks is enabled', () => {
    it('displays the new content', () => {
      landingPage.validateHealthToolsLinksEnabled();
      cy.axeCheck();
    });
  });

  context('when mhvLandingPageEnableVaGovHealthToolsLinks is disabled', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles', {
        data: {
          features: [
            {
              name: 'mhvLandingPageEnableVaGovHealthToolsLinks',
              value: false,
            },
          ],
        },
      });
      landingPage.visitPage();
    });

    it('displays the default content', () => {
      landingPage.validateHealthToolsLinksDisabled();
      cy.axeCheck();
    });
  });
});

export default new LandingPage();
