import { initMockProfile } from './cypress-helpers';
import vetTecProfile from '../data/vet-tec-profile.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';
import { createId } from '../../utils/helpers';
import { displayLearnMoreModal, collapseExpandAccordion } from './gi-helpers';

describe('VETTEC', () => {
  beforeEach(() => {
    cy.route('/v0/gi/institution_programs/search', vetTecSearchResults);

    initMockProfile(vetTecProfile);

    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();
  });

  it('Default VETTEC profile flow with giBillChapter chapter 33', () => {
    // Landing Page
    cy.get('input[name="category"][value="vettec"]')
      .check()
      .axeCheck();

    cy.get('#search-button')
      .click()
      .url()
      .should('include', '/program-search');

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

    cy.get(`a[href*="${profileLink}"]`)
      .click()
      .url()
      .should('include', profileLink)
      .axeCheck();

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
