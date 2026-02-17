import stub from '../../constants/stub.json';
import stubPage2 from '../../constants/stub-page-2.json';
import stubNewTerm from '../../constants/stub-new-term.json';
import zeroResultsStub from '../../constants/stubZeroResults.json';
import {
  SELECTORS as s,
  verifyRecommendationsLink,
  verifyResultsLink,
} from './helpers';

describe('Global search', () => {
  it('successfully searches and renders results when landing on the page with a search term', () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: stub,
      statusCode: 200,
    });

    cy.intercept('GET', '/v0/search?query=benefits&page=2', {
      body: stubPage2,
      statusCode: 200,
    });

    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      cy.get(s.SEARCH_RESULTS_COUNTER)
        .should('be.visible')
        .should('have.text', 'Showing 1-10 of 12 results for "benefits"');

      verifyRecommendationsLink('VA Health Home Page', '/health');

      verifyRecommendationsLink(
        'CHAMPVA Benefits',
        '/health-care/family-caregiver-benefits/champva/',
      );

      verifyResultsLink(
        'Veterans Benefits Administration Home',
        'https://benefits.va.gov/benefits/',
      );

      verifyResultsLink('Download VA benefit letters', '/download-va-letters/');
      verifyResultsLink(
        'VA benefits for spouses, dependents, survivors, and family caregivers',
        '/family-member-benefits/',
      );

      cy.get(s.ERROR_ALERT_BOX).should('not.exist');

      cy.get(s.PAGINATION).should('exist').scrollIntoView();

      cy.get(s.PAGINATION).within(() => {
        cy.get('nav li').should('have.length', 3); // includes Next link
        cy.get('nav li').eq(1).click();
      });
    });

    cy.get(s.SEARCH_RESULTS_COUNTER)
      .should('exist')
      .should('have.text', 'Showing 11-12 of 12 results for "benefits"');

    verifyResultsLink(
      'Burial Benefits - Compensation',
      'https://benefits.va.gov/COMPENSATION/claims-special-burial.asp',
    );

    verifyResultsLink(
      'Direct deposit for your VA benefit payments',
      '/resources/direct-deposit-for-your-va-benefit-payments/',
    );

    cy.axeCheck();
  });

  it('successfully searches and renders results when searching on the results page', () => {
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    });

    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');

      cy.get(s.SEARCH_INPUT).focus();
      cy.get(s.SEARCH_INPUT).clear();
      cy.get(s.SEARCH_INPUT).type('benefits');
      cy.get(s.SEARCH_BUTTON).click();

      verifyResultsLink(
        'Veterans Benefits Administration Home',
        'https://benefits.va.gov/benefits/',
      );

      verifyResultsLink('Download VA benefit letters', '/download-va-letters/');

      verifyResultsLink(
        'VA benefits for spouses, dependents, survivors, and family caregivers',
        '/family-member-benefits/',
      );

      cy.get(s.ERROR_ALERT_BOX).should('not.exist');
    });

    cy.axeCheck();
  });

  it('shows the correct messaging when the API calls succeed but there are no results', () => {
    cy.intercept('GET', '/v0/search?query=*', {
      body: zeroResultsStub,
      statusCode: 200,
    });

    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).type('benefits');
      cy.get(s.SEARCH_BUTTON).click();
      cy.get(s.SEARCH_RESULTS_EMPTY)
        .should('be.visible')
        .should('contain.text', `We didn’t find any results for "benefits."`);
      cy.get(s.ERROR_ALERT_BOX).should('not.exist');
      cy.get(s.TOP_RECOMMENDATIONS).should('not.exist');
      cy.get(s.SEARCH_RESULTS).should('not.exist');
    });

    cy.axeCheck();
  });

  it('shows the correct messaging when the page is loaded with no search term', () => {
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    });

    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_RESULTS_EMPTY)
        .should('be.visible')
        .should('contain.text', `We didn’t find any results.`);
      cy.get(s.ERROR_ALERT_BOX).should('not.exist');
      cy.get(s.TOP_RECOMMENDATIONS).should('not.exist');
      cy.get(s.SEARCH_RESULTS).should('not.exist');
    });

    cy.axeCheck();
  });

  it('shows the correct results when a new term is searched', () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: stub,
      statusCode: 200,
    });

    cy.intercept('GET', '/v0/search?query=military&page=1', {
      body: stubNewTerm,
      statusCode: 200,
    });

    cy.visit('/search/?query=benefits');

    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      cy.get(s.SEARCH_RESULTS_COUNTER)
        .should('be.visible')
        .should('have.text', 'Showing 1-10 of 12 results for "benefits"');

      verifyRecommendationsLink('VA Health Home Page', '/health');

      verifyRecommendationsLink(
        'CHAMPVA Benefits',
        '/health-care/family-caregiver-benefits/champva/',
      );

      verifyResultsLink(
        'Veterans Benefits Administration Home',
        'https://benefits.va.gov/benefits/',
      );

      cy.get(s.SEARCH_INPUT).focus().clear();
      cy.get(s.SEARCH_INPUT).type('military');
      cy.get(s.SEARCH_BUTTON).click();

      cy.get(s.SEARCH_RESULTS_COUNTER)
        .should('be.visible')
        .should('have.text', 'Showing 1-5 of 5 results for "military"');

      verifyRecommendationsLink(
        'What to Expect at a Military Funeral',
        '/burials-memorials/what-to-expect-at-military-funeral/',
      );

      verifyRecommendationsLink(
        'Military Sexual Trauma (MST)',
        '/health-care/health-needs-conditions/military-sexual-trauma/',
      );

      verifyResultsLink(
        'Request your military service records (including DD214)',
        '/records/get-military-service-records',
      );

      verifyResultsLink(
        'Military sexual trauma (MST)',
        '/health-care/health-needs-conditions/military-sexual-trauma/',
      );

      verifyResultsLink('About VA Form SF180', '/forms/sf180/');
    });

    cy.axeCheck();
  });
});
