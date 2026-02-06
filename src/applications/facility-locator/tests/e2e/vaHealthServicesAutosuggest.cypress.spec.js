import * as h from './helpers';
import vaHealthServicesData from '../hooks/test-va-healthcare-services.json';
import searchResultsData from './autosuggest-data/services-autosuggest.json';

describe('VA health services autosuggest', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        features: [
          {
            name: 'facilities_autosuggest_vamc_services_enabled',
            value: true,
          },
          {
            name: 'facilities_use_fl_progressive_disclosure',
            value: true,
          },
        ],
      },
    });

    cy.intercept(
      'GET',
      '**/data/cms/va-healthcare-services.json',
      vaHealthServicesData.data,
    ).as('vaHealthServices');

    cy.intercept('POST', '**/facilities_api/v2/va', searchResultsData).as(
      'searchResultsData',
    );
  });

  const verifyDropdownIsOpen = () => {
    cy.get(h.AUTOSUGGEST_INPUT).should('have.attr', 'aria-expanded', 'true');
  };

  const verifyDropdownIsClosed = () => {
    cy.get(h.AUTOSUGGEST_INPUT).should('have.attr', 'aria-expanded', 'false');
  };

  describe('when VA health is selected and an address is added', () => {
    it('should correctly load the basic view', () => {
      cy.visit(h.ROOT_URL);
      cy.injectAxeThenAxeCheck();

      h.typeInCityStateInput('Atlanta, GA');
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.HEALTH);

      cy.wait('@vaHealthServices');

      h.verifyElementExists(h.AUTOSUGGEST_INPUT);

      // Open dropdown with no search, verify services are available inside, search
      h.clickElement(h.AUTOSUGGEST_ARROW);
      h.verifyElementByText('All VA health services').click();
      verifyDropdownIsClosed();

      h.submitSearchForm();

      cy.wait('@searchResultsData');

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        'results for "VA health", "All VA health services" near "Atlanta, Georgia',
      );

      h.clickElement(h.AUTOSUGGEST_CLEAR);

      // Type a string, select a result and search
      h.typeInAutosuggestInput('Pol');
      verifyDropdownIsOpen();

      cy.get(h.AUTOSUGGEST_INPUT).type('{downArrow}{downArrow}{enter}');

      verifyDropdownIsClosed();

      h.submitSearchForm();

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        'results for "VA health", "Polytrauma and traumatic brain injury (TBI and multiple traumas)" near "Atlanta, Georgia"',
      );

      h.clickElement(h.AUTOSUGGEST_ARROW);

      cy.get('#vamc-services-autosuggest-container').within(() => {
        cy.get(h.OPTIONS).should('have.length', 2);
      });

      // Erase part of the full service name in the input to verify
      // that the filter runs again and returns no results
      cy.get(h.AUTOSUGGEST_INPUT)
        .focus()
        .type('{backspace}{backspace}{backspace}');

      h.scrollToThenVerifyElementByText('No results found.');

      h.clickElement(h.AUTOSUGGEST_CLEAR);

      // New search with a different service
      h.typeInAutosuggestInput('cancer');

      verifyDropdownIsOpen();

      h.scrollToThenVerifyElementByText('Cancer care').click();

      verifyDropdownIsClosed();

      h.clickElement(h.AUTOSUGGEST_CLEAR);

      // New search with an invalid service
      h.typeInAutosuggestInput('INVALID');

      h.verifyElementByText('No results found.');

      // Click out of the autosuggest input and search
      // to verify that "All VA health services" is used for the search
      cy.get('.desktop-search-controls-container').click();

      h.submitSearchForm();

      h.verifyElementShouldContainText(
        h.SEARCH_RESULTS_SUMMARY,
        'All VA health services',
      );
    });
  });
});
