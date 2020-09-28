import { initMockProfile } from './cypress-helpers';
import vetTecProfile from '../data/vet-tec-profile.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';
import { verifyVetTecSearchResults } from './gi-helpers';

describe.skip('VETTEC', () => {
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

    cy.get('#search-button').click();
    cy.url().should('include', '/program-search');
    cy.axeCheck();

    cy.get('.filter-button')
      .should('be.visible')
      .click();
    cy.axeCheck();

    cy.get('[data-cy=see-results]')
      .should('be.visible')
      .click();
    cy.axeCheck();

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
      .get('.profile-page');
    cy.get('body').axeCheck();
  });
});
