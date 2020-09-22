import { initMockProfile, FORCE_OPTION } from './cypress-helpers';
import institutionProfile from '../data/institution-profile.json';
import searchResults from '../data/search-results.json';
import { typeOfInstitution, selectSearchResult } from './gi-helpers';

describe('GI Bill Comparison Tool mobile view', () => {
  beforeEach(() => {
    cy.route('/v0/gi/institution/search', searchResults);

    initMockProfile(institutionProfile);

    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();
  });

  it('Default GIBCT mobile view profile flow with giBillChapter chapter 33', () => {
    cy.viewport(481, 750);

    // Landing Page
    typeOfInstitution('school');
    cy.axeCheck();

    cy.get('.keyword-search input[type="text"]').type(
      searchResults.data[0].attributes.name,
    );
    cy.get('#search-button').click();
    cy.axeCheck();

    // Search Page
    cy.get('[data-cy=filter-button').should('be.visible');
    cy.get('[data-cy=filter-button').click(FORCE_OPTION);

    cy.axeCheck();

    cy.get('[data-cy=see-results]').click(FORCE_OPTION);
    cy.axeCheck();

    const profileLink = `/profile/${
      searchResults.data[0].attributes.facility_code
    }`;
    selectSearchResult(profileLink);

    // Profile Page
    cy.axeCheck();
  });
});
