import { initApplicationMock, expectLocation } from './cypress-helpers';
import institutionProfile from '../data/institution-profile.json';
import searchResults from '../data/search-results.json';
import { createId } from '../../utils/helpers';
import {
  search,
  selectSearchResult,
  displayLearnMoreModal,
  collapseExpandAccordion,
} from './gi-helpers';

const institutionAttributes = institutionProfile.data.attributes;

describe('Institution', () => {
  beforeEach(() => {
    initApplicationMock();
    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();
  });

  it('Default institution profile flow with giBillChapter chapter 33', () => {
    // Landing Page

    cy.axeCheck();
    cy
      .get('.keyword-search input[type="text"]')
      .type(institutionAttributes.name).type;
    search();
    expectLocation('/search');

    // Search Page
    searchResults.data.forEach(result => {
      const resultId = `#search-result-${result.attributes.facility_code}`;
      cy.log(resultId);
      cy.get(createId(resultId)).should('be.visible');
    });

    const profileLink = `/profile/${
      searchResults.data[0].attributes.facility_code
    }`;

    selectSearchResult(profileLink);

    // Profile Page
    displayLearnMoreModal();

    // Estimate your benefits
    collapseExpandAccordion('Estimate your benefits');

    // Veteran programs
    collapseExpandAccordion('Veteran programs');

    // School locations
    collapseExpandAccordion('School locations');

    // Cautionary information
    collapseExpandAccordion('Cautionary information');

    // Contact details
    collapseExpandAccordion('Contact details');

    // Additional information
    collapseExpandAccordion('Additional information');
  });
});
