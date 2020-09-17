import { initMockProfile, clickButton } from './cypress-helpers';
import institutionProfile from '../data/institution-profile.json';
import searchResults from '../data/search-results.json';
import { typeOfInstitution, search, selectSearchResult } from './gi-helpers';

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

    search('DODGE CITY COMMUNITY COLLEGE');
    cy.axeCheck();

    // Search Page
    clickButton('.filter-button');
    cy.axeCheck();

    clickButton('[data-cy=see-results]');

    const profileLink = `/profile/${
      searchResults.data[0].attributes.facility_code
    }`;
    selectSearchResult(profileLink);

    // Profile Page
    cy.axeCheck();
  });
});
