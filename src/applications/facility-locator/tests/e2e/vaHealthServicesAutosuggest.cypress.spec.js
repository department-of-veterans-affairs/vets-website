import * as h from './helpers';

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
      h.verifyElementExists(h.AUTOSUGGEST_INPUT);

      h.clickElement(h.AUTOSUGGEST_ARROW);

      verifyDropdownIsOpen();

      h.verifyElementByText('All VA health services').click();

      verifyDropdownIsClosed();

      h.submitSearchForm();

      h.verifyElementShouldContainText(
        h.SEARCH_RESULTS_SUMMARY,
        'No results found',
      );
    });
  });
});
