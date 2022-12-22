import folderInfo from '../fixtures/folder-response.json';

class PatientBasicSearchPage {
  // This method clicks the Search messages on the side navigation bar.
  clickSearchMessage = () => {
    cy.get('[data-testid="search-messages-sidebar"]').click();
  };

  // This method will access the input field and enters the text that will be used for search.

  getInputFieldText = text => {
    cy.get('[data-testid="keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type(text);
  };

  // This method clicks the Search button.
  submitSearch = () => {
    cy.get('[data-testid="basic-search-submit"]').click({ force: true });
  };

  // This method verifies the highlighted text in the messages returned after clicking the search button.

  verifyHighlightedText = text => {
    cy.get('[data-testid="highlighted-text"]').should('contain', text);
  };

  // This method selects the folder from the drop down menu.

  selectMessagesFolder = folderName => {
    folderInfo.data.attributes.name = folderName;
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select(folderName, { force: true });
  };
}
export default PatientBasicSearchPage;
