import { initApplicationMock } from './cypress-helpers';
import {
  calculatorConstants,
  verifySearchResults,
  checkSectionAccordion,
  checkProfileHousingRate,
  breadCrumb,
  enrolledOld,
} from './gi-helpers';
import { formatCurrency, formatNumber } from '../../utils/helpers';

const institutionProfile = require('../data/institution-profile.json');
const deaSearchResults = require('../data/dea-search-results.json');
const ojtProfile = require('../data/ojt-profile.json');

describe('DEA benefit', () => {
  const ojtFacilityCode = deaSearchResults.data[0].attributes.facility_code;
  const facilityCode = deaSearchResults.data[1].attributes.facility_code;

  beforeEach(() => {
    cy.route('GET', `/v0/gi/institutions/${ojtFacilityCode}`, ojtProfile).as(
      'ojtProfile',
    );
    initApplicationMock(institutionProfile, deaSearchResults);
    cy.visit('/gi-bill-comparison-tool');
    cy.injectAxeThenAxeCheck();
  });

  it('path is valid without errors', () => {
    const searchTerm = 'WISCONSIN';

    // Landing page
    // Select DEA benefit and search
    cy.get('#giBillChapter').select('35');
    cy.get('.keyword-search input[type="text"]').type(searchTerm);
    cy.get('#search-button').click();

    // Search page
    cy.wait('@defaultSearch');
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', `/search?category=school&name=${searchTerm}`);

    // verify search results and housing rates
    verifySearchResults(deaSearchResults);
    deaSearchResults.data.forEach(({ attributes: profile }) => {
      const housingRate =
        profile.type === 'OJT'
          ? calculatorConstants.DEARATEOJT
          : calculatorConstants.DEARATEFULLTIME;

      cy.get(`#housing-value-${profile.facility_code}`).contains(
        formatCurrency(housingRate),
      );
    });

    // Verify that the category filter updates location
    cy.get('input[name="category"][value="ALL"]').check();
    cy.url().should('include', `/search?category=ALL&name=${searchTerm}`);

    cy.get('#giBillChapter')
      .invoke('val')
      .should('eq', '35');

    cy.get(`#search-result-${ojtFacilityCode} a`)
      .first()
      .scrollIntoView();

    // Click first result
    cy.get(`#search-result-${ojtFacilityCode} a`)
      .first()
      .should('be.visible')
      .click({ force: true });

    // Profile page
    cy.wait('@ojtProfile');
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', `/profile/${ojtFacilityCode}`);
    cy.get('.profile-page').should('be.visible');

    // Check accordions
    const eybSections = {
      yourMilitaryDetails: 'Your military details',
      learningFormat: 'Learning format and schedule',
    };

    cy.get('#giBillChapter').should('be.visible');
    cy.get('#giBillChapter').scrollIntoView();
    cy.get('#giBillChapter')
      .invoke('val')
      .should('eq', '35');

    checkSectionAccordion(false, 'yourMilitaryDetails', eybSections);

    checkSectionAccordion(true, 'learningFormat', eybSections);

    // Verify enrollment values update housing benefit correctly
    [2, 16, 30].forEach(enrolledAmount => {
      const value = Math.round(
        (enrolledAmount / 30) * formatNumber(calculatorConstants.DEARATEOJT),
      );

      cy.get('select[name="working"]').select(enrolledAmount.toString());
      cy.get('.calculate-button').click();
      checkProfileHousingRate(value);
    });

    // Back to the landing page
    breadCrumb('/gi-bill-comparison-tool/');

    // Search again
    cy.get('.keyword-search input[type="text"]').type(searchTerm);
    cy.get('#search-button').click();

    // Search page
    cy.wait('@defaultSearch');
    cy.url().should('include', `/search?category=school&name=${searchTerm}`);

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
