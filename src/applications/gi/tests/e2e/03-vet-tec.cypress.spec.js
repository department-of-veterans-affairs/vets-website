import { initMockProfile } from './cypress-helpers';
import vetTecProfile from '../data/vet-tec-profile.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';
import {
  displayLearnMoreModal,
  collapseExpandAccordion,
  verifyVetTecSearchResults,
} from './gi-helpers';

describe('VETTEC', () => {
  beforeEach(() => {
    cy.route('/v0/gi/institution_programs/search', vetTecSearchResults);

    initMockProfile(vetTecProfile);

    cy.visit('/gi-bill-comparison-tool');
    cy.injectAxeThenAxeCheck();
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
    verifyVetTecSearchResults();

    const vetTecAttributes = vetTecSearchResults.data[0].attributes;
    const profileLink = `/profile/${vetTecAttributes.facility_code}/${
      vetTecAttributes.description
    }`;

    cy.get(`a[href*="${profileLink}"]`)
      .first()
      .should('be.visible')
      .click({ force: true });

    // Profile Page
    cy.wait(`@profile${vetTecAttributes.facility_code}`)
      .url()
      .should('include', vetTecAttributes.facility_code)
      .get('.profile-page')
      .should('be.visible');

    cy.get('body');
    cy.injectAxeThenAxeCheck();

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
