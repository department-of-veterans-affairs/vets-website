import { initApplicationMock } from './cypress-helpers';
import institutionProfile from '../data/institution-profile.json';
import searchResults from '../data/search-results.json';
import {
  displayLearnMoreModal,
  collapseExpandAccordion,
  verifySearchResults,
  checkSectionAccordion,
} from './gi-helpers';

const institutionAttributes = institutionProfile.data.attributes;

describe('Institution', () => {
  beforeEach(() => {
    initApplicationMock();
    cy.visit('/gi-bill-comparison-tool');
    cy.injectAxeThenAxeCheck();
  });

  it('Default institution profile flow with giBillChapter chapter 33', () => {
    // Landing Page
    cy.get('.keyword-search input[type="text"]').type(
      institutionAttributes.name,
    );
    cy.get('#search-button').click();
    cy.injectAxeThenAxeCheck();

    // Search Page
    verifySearchResults(searchResults);

    const facilityCode = searchResults.data[0].attributes.facility_code;

    cy.get(`#search-result-${facilityCode} a`)
      .first()
      .scrollIntoView();

    // Select the second search result
    cy.get(`#search-result-${facilityCode} a`)
      .first()
      .should('be.visible')
      .click({ force: true });

    // Profile page
    cy.wait(`@profile${facilityCode}`);
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', `/profile/${facilityCode}`);
    cy.get('.profile-page').should('be.visible');

    displayLearnMoreModal();

    // Estimate your benefits
    collapseExpandAccordion('Estimate your benefits');

    // Estimate your benefits section accordions
    checkSectionAccordion(false, 'yourMilitaryDetails');
    checkSectionAccordion(true, 'schoolCostsAndCalendar');
    checkSectionAccordion(true, 'learningFormat');
    checkSectionAccordion(true, 'scholarshipsAndOtherVAFunding');

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
