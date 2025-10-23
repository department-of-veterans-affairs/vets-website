import { SELECTORS as s } from './helpers';

// Since the search bar in the header connects to the main search app,
// we need these tests to make sure the connection works as expected
describe('Global search from the header', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v0/search_typeahead?query=benefits', [
      'benefits response 1',
      'benefits response 2',
      'benefits response 3',
      'benefits response 4',
      'benefits response 5',
    ]);

    cy.intercept('GET', 'v0/search_typeahead?query=health', [
      'health response 1',
      'health response 2',
      'health response 3',
      'health response 4',
      'health response 5',
    ]);
  });

  const loadAndAddSearchTerm = term => {
    cy.visit('/');
    cy.get(s.HEADER_SEARCH_TRIGGER).click();
    cy.get(s.HEADER_SEARCH_FIELD).click();
    cy.get(s.HEADER_SEARCH_FIELD)
      .should('exist')
      .should('not.be.disabled')
      .type(term, { force: true });
  };

  const verifyTypeaheadDropdown = () => {
    cy.get(s.HEADER_TYPEAHEAD_DROPDOWN).should('be.visible');
    cy.get(s.HEADER_TYPEAHEAD_DROPDOWN)
      .children()
      .should('have.length', 5);
  };

  const verifyTypeaheadDropdownCloses = () => {
    cy.get(s.HEADER_SEARCH_SUBMIT).focus();
    cy.get(s.HEADER_TYPEAHEAD_DROPDOWN).should('not.exist');
  };

  const verifyUrlContains = queryString => {
    cy.url().should('contain', queryString);
  };

  const focusOnSubmitButton = () => {
    cy.get(s.HEADER_SEARCH_SUBMIT).focus();
  };

  it('shows the dropdown from the header', () => {
    loadAndAddSearchTerm('benefits');
    cy.injectAxeThenAxeCheck();
  });

  it('shows suggestions when a search term is present', () => {
    loadAndAddSearchTerm('benefits');
    verifyTypeaheadDropdown();
    cy.injectAxeThenAxeCheck();
  });

  it('closes the typeahead dropdown when the search button is focused', () => {
    loadAndAddSearchTerm('benefits');
    verifyTypeaheadDropdown();
    verifyTypeaheadDropdownCloses();
    cy.injectAxeThenAxeCheck();
  });

  it('opens the typeahead dropdown again when the input field is focused again', () => {
    loadAndAddSearchTerm('health');
    verifyTypeaheadDropdown();
    verifyTypeaheadDropdownCloses();
    cy.get(s.HEADER_SEARCH_FIELD).focus();
    verifyTypeaheadDropdown();
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

  it('should navigate to the main search page when a typeahead suggestion is clicked', () => {
    loadAndAddSearchTerm('health');
    verifyTypeaheadDropdown();
    cy.get(`#search-header-dropdown-option-3`).click();
    verifyUrlContains(`/search/?query=health%20response%204`);
    cy.injectAxeThenAxeCheck();
  });

  it('allows the user to use the arrow keys to navigate suggestions and press enter to search one', () => {
    loadAndAddSearchTerm('benefits');
    verifyTypeaheadDropdown();
    cy.get(s.HEADER_SEARCH_FIELD).type('{downarrow}');
    cy.get(s.HEADER_SEARCH_FIELD).type('{downarrow}');
    cy.get(s.HEADER_SEARCH_FIELD).type('{downarrow}');
    cy.get(s.HEADER_SEARCH_FIELD).type('{enter}');
    verifyUrlContains(`/search/?query=benefits%20response%203`);
    cy.injectAxeThenAxeCheck();
  });
});
