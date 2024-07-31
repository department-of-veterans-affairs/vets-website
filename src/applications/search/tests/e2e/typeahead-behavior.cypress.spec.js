import stub from '../../constants/stub.json';
// import stubPage2 from '../../constants/stub-page-2.json';
// import zeroResultsStub from '../../constants/stubZeroResults.json';
import {
  SELECTORS as s,
  verifyRecommendationsLink,
  verifyResultsLink,
} from './helpers';

describe('Global search typeahead behavior', () => {
  const verifyTAResult = (index, text) => {
    cy.get(s.TYPEAHEAD_OPTIONS)
      .eq(index)
      .should('be.visible')
      .should('have.text', text);
  };

  it('correctly shows typeahead results', () => {
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    });

    cy.intercept('GET', '/v0/search_typeahead?query=*', {
      body: [
        'benefits for assisted living',
        'benefits for terminally ill',
        'benefits',
        'benefits letter',
        'benefits for family of deceased',
      ],
      statusCode: 200,
    });

    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).type('benefits');
      cy.get(s.TYPEAHEAD_DROPDOWN).should('be.visible');
      cy.get(s.SEARCH_INPUT).focus();

      verifyTAResult(0, 'benefits');
      verifyTAResult(1, 'benefits for assisted living');
      verifyTAResult(2, 'benefits for family of deceased');
      verifyTAResult(3, 'benefits for terminally ill');
      verifyTAResult(4, 'benefits letter');

      cy.get(s.ERROR_ALERT_BOX).should('not.exist');
      cy.get(s.MAINT_BOX).should('not.exist');
      cy.get(s.OUTAGE_BOX).should('not.exist');

      cy.get(s.TYPEAHEAD_OPTIONS)
        .eq(3)
        .click();

      cy.get(s.SEARCH_RESULTS_COUNTER)
        .should('be.visible')
        .should(
          'have.text',
          'Showing 1-10 of 12 results for "benefits for terminally ill"',
        );

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
    });

    cy.axeCheck();
  });
});
