/**
 * [TestRail-integrated] Spec for Search Type Ahead 2.0
 * @testrailinfo projectId 31
 * @testrailinfo suiteId 150
 * @testrailinfo groupId 2925
 * @testrailinfo runName TA-2.0-e2e
 */
import SearchComponent from '../page-object/searchComponent';

describe('Site-wide Search functionality with search dropdown component enabled', () => {
  const healthSearchTerm = 'health';
  const benefitsSearchTerm = 'benefits';
  const searchComponent = new SearchComponent();

  it('passes axe requirements - - C12121', () => {
    searchComponent.loadComponent(benefitsSearchTerm);
    searchComponent.confirmDropDown();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('shows suggestions when user input is present and typeahead is enabled - - C12122', () => {
    searchComponent.loadComponent(benefitsSearchTerm);
    searchComponent.confirmDropDown();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Focusing the search button hides user input - - C12123', () => {
    searchComponent.loadComponent(benefitsSearchTerm);
    searchComponent.confirmDropDown();
    searchComponent.confirmSearchFocusHidesInput();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Focusing the input field repopulates suggestions - - C12124', () => {
    searchComponent.loadComponent(healthSearchTerm);
    searchComponent.confirmDropDown();
    searchComponent.confirmSearchFocusHidesInput();
    searchComponent.focusOnInputField();
    searchComponent.confirmDropDown();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Clicking search button initiates search for input - C12125', () => {
    searchComponent.loadComponent(healthSearchTerm);
    searchComponent.clickSubmitButton();
    searchComponent.checkIfUrlContains(`/search/?query=${healthSearchTerm}`);

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Pressing enter (focus on input field) initiates search for input - C12126', () => {
    searchComponent.loadComponent(healthSearchTerm);
    searchComponent.clickEnterInInputField();
    searchComponent.checkIfUrlContains(`/search/?query=${healthSearchTerm}`);

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Pressing enter (focus on search button) initiates search for input - C12127', () => {
    searchComponent.loadComponent(benefitsSearchTerm);
    searchComponent.clickSubmitButton();
    searchComponent.checkIfUrlContains(`/search/?query=${benefitsSearchTerm}`);

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Pressing space (focus on search button) initiates search for input - C12128', () => {
    searchComponent.loadComponent(healthSearchTerm);
    searchComponent.clickSubmitButton();
    searchComponent.checkIfUrlContains(`/search/?query=${healthSearchTerm}`);

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Clicking a dropdown option initiates a search using the suggestion - C12129', () => {
    searchComponent.loadComponent(healthSearchTerm);
    searchComponent.confirmDropDown();
    searchComponent.clickTypeAheadItem();
    searchComponent.checkIfUrlContains(
      `/search/?query=${healthSearchTerm}%20response%204`,
    );

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Can use the arrow keys to navigate suggestions, and press enter to search using them - C12130', () => {
    searchComponent.loadComponent(benefitsSearchTerm);
    searchComponent.confirmDropDown();
    searchComponent.navigateSearchSuggestions();
    searchComponent.checkIfUrlContains(
      `/search/?query=${benefitsSearchTerm}%20response%203`,
    );

    cy.injectAxe();
    cy.axeCheck();
  });
});
