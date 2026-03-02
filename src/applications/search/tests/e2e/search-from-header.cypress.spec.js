import { SELECTORS as s } from './helpers';

// Since the search bar in the header connects to the main search app,
// we need these tests to make sure the connection works as expected
describe('Global search from the header', () => {
  const loadAndAddSearchTerm = term => {
    cy.visit('/');
    cy.get(s.HEADER_SEARCH_TRIGGER).click();
    cy.get(s.HEADER_SEARCH_FIELD).click();
    cy.get(s.HEADER_SEARCH_FIELD)
      .should('exist')
      .should('not.be.disabled')
      .type(term, { force: true });
  };

  const verifyTypeaheadDropdownNotShown = () => {
    // Verify that typeahead dropdown does not appear
    cy.get(s.HEADER_TYPEAHEAD_DROPDOWN).should('not.exist');
  };

  const verifyUrlContains = queryString => {
    cy.url().should('contain', queryString);
  };

  const focusOnSubmitButton = () => {
    cy.get(s.HEADER_SEARCH_SUBMIT).focus();
  };

  it('does not show typeahead dropdown when typing in the search field', () => {
    loadAndAddSearchTerm('benefits');
    verifyTypeaheadDropdownNotShown();
    cy.injectAxeThenAxeCheck();
  });

  it('should navigate to the main search page when the input is focused and the search button is clicked', () => {
    loadAndAddSearchTerm('health');
    cy.get(s.HEADER_SEARCH_SUBMIT).click();
    verifyUrlContains(`/search/?query=health`);
    cy.injectAxeThenAxeCheck();
  });

  it('should navigate to the main search page when the input is focused and the "Enter" key is pressed', () => {
    loadAndAddSearchTerm('health');
    cy.get(s.HEADER_SEARCH_FIELD).type('{enter}');
    verifyUrlContains(`/search/?query=health`);
    cy.injectAxeThenAxeCheck();
  });

  it('should navigate to the main search page when the focus is on the search button and the "Enter" key is pressed', () => {
    loadAndAddSearchTerm('health');
    focusOnSubmitButton();
    cy.realPress('{enter}');
    verifyUrlContains(`/search/?query=health`);
    cy.injectAxeThenAxeCheck();
  });

  it('should navigate to the main search page when the focus is on the search button and the "Space" key is pressed', () => {
    loadAndAddSearchTerm('health');
    focusOnSubmitButton();
    cy.realPress(' ');
    verifyUrlContains(`/search/?query=health`);
    cy.injectAxeThenAxeCheck();
  });

  it('verifies typeahead is disabled - no dropdown appears even after typing multiple characters', () => {
    loadAndAddSearchTerm('health');
    // Verify typeahead dropdown does not appear (typeahead is disabled)
    verifyTypeaheadDropdownNotShown();
    // Verify we can still search normally
    cy.get(s.HEADER_SEARCH_FIELD).type('{enter}');
    verifyUrlContains(`/search/?query=health`);
    cy.injectAxeThenAxeCheck();
  });
});
