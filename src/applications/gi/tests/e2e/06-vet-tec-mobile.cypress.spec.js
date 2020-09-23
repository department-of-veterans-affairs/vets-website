import { initMockProfile, forceClick } from './cypress-helpers';
import vetTecProfile from '../data/vet-tec-profile.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';
import { createId } from '../../utils/helpers';
import { typeOfInstitution, search, selectSearchResult } from './gi-helpers';

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
    typeOfInstitution('vettec');
    cy.axeCheck();

    search();
    forceClick('.filter-button');
    cy.axeCheck();

    forceClick('[data-cy=see-results]');
    cy.axeCheck();

    // Search Page
    vetTecSearchResults.data.forEach(result => {
      const resultId = `#search-result-${result.attributes.facility_code}-${
        result.attributes.description
      }`;
      cy.get(createId(resultId)).should('be.visible');
    });

    const vetTecAttributes = vetTecSearchResults.data[0].attributes;
    const profileLink = `/profile/${vetTecAttributes.facility_code}/${
      vetTecAttributes.description
    }`;

    selectSearchResult(profileLink);

    // Profile Page
    cy.axeCheck();
  });
});
