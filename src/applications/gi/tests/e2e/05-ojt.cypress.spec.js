import { initApplicationMock } from './cypress-helpers';
import {
  collapseExpandAccordion,
  checkSectionAccordion,
  verifySearchResults,
} from './gi-helpers';

const ojtProfile = require('../data/ojt-profile.json');
const ojtSearchResults = require('../data/ojt-search-results.json');

describe('OJT institution', () => {
  it('path is valid without errors', () => {
    const searchTerm = ojtProfile.data.attributes.name;
    const facilityCode = ojtProfile.data.attributes.facility_code;
    initApplicationMock(ojtProfile, ojtSearchResults);

    // Landing page
    cy.visit('/gi-bill-comparison-tool');
    cy.injectAxeThenAxeCheck();
    cy.get('input[name*="category"][value="employer"]').check();
    cy.get('.keyword-search input[type="text"]').type(searchTerm);
    cy.get('#search-button').click();

    // Search page
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      `/search?category=employer&name=${encodeURIComponent(searchTerm).replace(
        /%20/g,
        '+',
      )}`,
    );
    verifySearchResults(ojtSearchResults);

    // Click first result
    cy.get(`#search-result-${facilityCode} a`)
      .first()
      .click({ waitForAnimations: true });

    // Profile page
    cy.injectAxeThenAxeCheck();
    const eybSections = {
      yourMilitaryDetails: 'Your military details',
      learningFormat: 'Learning format and schedule',
      scholarshipsAndOtherVAFunding: 'Scholarships and other VA funding',
    };

    // Estimate your benefits
    collapseExpandAccordion('Estimate your benefits');
    checkSectionAccordion(false, 'yourMilitaryDetails', eybSections);
    checkSectionAccordion(true, 'learningFormat', eybSections);
    checkSectionAccordion(true, 'scholarshipsAndOtherVAFunding', eybSections);

    // Cautionary information
    collapseExpandAccordion('Cautionary information');

    // Contact details
    collapseExpandAccordion('Contact details');

    // Additional information
    collapseExpandAccordion('Additional information');
  });
});
