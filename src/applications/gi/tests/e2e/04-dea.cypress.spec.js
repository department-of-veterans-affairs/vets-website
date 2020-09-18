import { initApplicationMock } from './cypress-helpers';
import {
  calculatorConstants,
  verifySearchResults,
  checkSectionAccordion,
  calculateBenefits,
  checkProfileHousingRate,
  breadCrumb,
  enrolledOld,
} from './gi-helpers';
import { formatCurrency, formatNumber } from '../../utils/helpers';

const institutionProfile = require('../data/institution-profile.json');
const deaSearchResults = require('../data/dea-search-results.json');
const ojtProfile = require('../data/ojt-profile.json');

describe('DEA benefit', () => {
  it('path is valid without errors', () => {
    const searchTerm = 'WISCONSIN';
    const ojtFacilityCode = deaSearchResults.data[0].attributes.facility_code;
    const facilityCode = deaSearchResults.data[1].attributes.facility_code;

    initApplicationMock(institutionProfile, deaSearchResults);
    cy.route('GET', `/v0/gi/institutions/${ojtFacilityCode}`, ojtProfile);

    // Landing page
    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();

    // Select DEA benefit and search
    cy.get('#giBillChapter').select('35');
    cy.get('.keyword-search input[type="text"]').type(searchTerm);
    cy.get('#search-button').click();

    // Search page
    cy.url().should('include', `/search?category=school&name=${searchTerm}`);

    // verify search results and housing rates
    verifySearchResults(deaSearchResults);
    deaSearchResults.data.forEach(({ attributes: profile }) => {
      let housingRate = calculatorConstants.DEARATEFULLTIME;
      if (profile.type === 'OJT') {
        housingRate = calculatorConstants.DEARATEOJT;
      }

      cy.get(`#housing-value-${profile.facility_code}`).contains(
        formatCurrency(housingRate),
      );
    });

    // Verify that the category filter updates location
    cy.get('input[name="category"][value="ALL"]').check();
    cy.url().should('include', `/search?category=ALL&name=${searchTerm}`);

    // Click first result
    cy.get(`#search-result-${ojtFacilityCode} a`)
      .first()
      .click();

    // Profile page
    cy.get('.profile-page').should('be.visible');
    cy.url().should('include', `/profile/${ojtFacilityCode}`);
    cy.axeCheck();

    // Check accordions
    const eybSections = {
      yourMilitaryDetails: 'Your military details',
      learningFormat: 'Learning format and schedule',
    };
    checkSectionAccordion(false, 'yourMilitaryDetails', eybSections);
    checkSectionAccordion(true, 'learningFormat', eybSections);

    // Verify enrollment values update housing benefit correctly
    const deaEnrolledMax = 30;
    for (
      let enrolledAmount = 2;
      enrolledAmount <= deaEnrolledMax;
      enrolledAmount += 2
    ) {
      const value = Math.round(
        (enrolledAmount / deaEnrolledMax) *
          formatNumber(calculatorConstants.DEARATEOJT),
      );

      cy.get('select[name="working"]').select(enrolledAmount.toString());
      calculateBenefits();
      checkProfileHousingRate(value);
    }

    // Back to the landing page
    breadCrumb('/gi-bill-comparison-tool/');

    // Search again
    cy.get('#search-button').click();

    // Search page
    cy.url().should('include', `/search?category=school&name=${searchTerm}`);

    // Select the second search result
    cy.get(`#search-result-${facilityCode} a`)
      .first()
      .click();

    // Profile page
    cy.url().should('include', `/profile/${facilityCode}`);
    cy.get('.profile-page').should('be.visible');

    // Verify enrollment options set housing correctly
    checkSectionAccordion(true, 'schoolCostsAndCalendar');
    const enrolledOldRates = [
      { rate: calculatorConstants.DEARATEFULLTIME, option: 'full' },
      {
        rate: calculatorConstants.DEARATETHREEQUARTERS,
        option: 'three quarters',
      },
      { rate: calculatorConstants.DEARATEONEHALF, option: 'half' },
      {
        rate: 300,
        option: 'less than half',
      },
      {
        rate: 300,
        option: 'quarter',
      },
    ];
    enrolledOldRates.forEach(({ rate, option }) => {
      enrolledOld(option, rate);
    });
  });
});
