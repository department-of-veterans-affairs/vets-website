import { initApplicationMock } from './cypress-helpers';

const institutionProfile = require('../data/institution-profile.json');
const searchResults = require('../data/search-results.json');

describe('GI Bill Comparison Tool mobile view', () => {
  beforeEach(() => {
    cy.route('/v0/gi/institution/search', searchResults);

    initApplicationMock(institutionProfile, searchResults);

    cy.visit('/gi-bill-comparison-tool');
    cy.injectAxeThenAxeCheck();
  });

  it('Default GIBCT mobile view profile flow with giBillChapter chapter 33', () => {
    cy.viewport(481, 750);

    // Landing Page
    const selector = `input[name="category"][value="school"]`;
    cy.get(selector).check({ force: true });
    cy.axeCheck();

    cy.get('.keyword-search input[type="text"]').type(
      searchResults.data[0].attributes.name,
    );
    cy.get('#search-button').click();
    cy.injectAxeThenAxeCheck();

    // Search Page
    cy.get('[data-cy=filter-button').should('be.visible');
    cy.get('[data-cy=filter-button').click({ force: true });
    cy.injectAxeThenAxeCheck();

    cy.get('[data-cy=see-results]').click({ force: true });
    cy.axeCheck();

    const facilityCode = searchResults.data[0].attributes.facility_code;

    // Select the second search result
    cy.get(`#search-result-${facilityCode} a`)
      .first()
      .should('be.visible')
      .click({ force: true });

    // Profile page
    cy.wait(`@profile${facilityCode}`);
    cy.url().should('include', `/profile/${facilityCode}`);
    cy.get('.profile-page').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
