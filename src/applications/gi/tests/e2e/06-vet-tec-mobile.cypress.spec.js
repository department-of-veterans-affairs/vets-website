import { initMockProfile } from './cypress-helpers';
import vetTecProfile from '../data/vet-tec-profile.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';
import {
  search,
  selectSearchResult,
  verifyVetTecSearchResults,
} from './gi-helpers';

describe('VETTEC', () => {
  beforeEach(() => {
    cy.route('/v0/gi/institution_programs/search', vetTecSearchResults);

    initMockProfile(vetTecProfile);

    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();
  });

  it('Default VETTEC profile flow with giBillChapter chapter 33', () => {
    cy.viewport(481, 750);
    // Landing Page
    cy.get('input[name="category"][value="vettec"]').check();
    cy.axeCheck();

    search();
    cy.get('.filter-button').click();
    cy.axeCheck();

    cy.get('[data-cy=see-results]').click();
    cy.axeCheck();

    // Search Page
    verifyVetTecSearchResults();

    const vetTecAttributes = vetTecSearchResults.data[0].attributes;
    const profileLink = `/profile/${vetTecAttributes.facility_code}/${
      vetTecAttributes.description
    }`;

    selectSearchResult(profileLink);

    // Profile Page
    cy.axeCheck();
  });
});
