import { initMockProfile, expectLocation } from './cypress-helpers';
import vetTecProfile from '../data/vet-tec-profile.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';
import { createId } from '../../utils/helpers';
import {
  typeOfInstitution,
  search,
  selectSearchResult,
  displayLearnMoreModal,
  collapseExpandAccordion,
} from './gi-helpers';

describe('VETTEC', () => {
  beforeEach(() => {
    cy.route('/v0/gi/institution_programs/search', vetTecSearchResults);

    initMockProfile(vetTecProfile);

    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();
  });

  it('Default VETTEC profile flow with giBillChapter chapter 33', () => {
    // Landing Page
    typeOfInstitution('vettec');
    cy.axeCheck();

    search();
    expectLocation('/program-search');

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

    displayLearnMoreModal();
    // Approved programs
    collapseExpandAccordion('Approved programs');

    // Estimate your benefits
    collapseExpandAccordion('Estimate your benefits');

    // Veteran programs
    collapseExpandAccordion('Veteran programs');

    // Application process
    collapseExpandAccordion('Application process');

    // Contact details
    collapseExpandAccordion('Contact details');

    // Additional information
    collapseExpandAccordion('Additional information');
  });
});
