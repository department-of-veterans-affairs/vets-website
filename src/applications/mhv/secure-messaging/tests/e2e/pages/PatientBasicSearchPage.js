class PatientBasicSearchPage {
  // This method clicks the Search messages on the side navigation bar.
  clickSearchMessage = () => {
    cy.get('[data-testid="search-messages-sidebar"]').click();
  };

  // This method will access the input field and enters the text that will be used for search.

  typeSearchInputFieldText = text => {
    cy.get('[data-testid="keyword-search-input"]')
      .shadow()
      .find('[id="filter-input"]')
      .type(text, { waitforanimations: false });
  };

  // This method clicks the Search button.
  submitSearch = () => {
    cy.get('[data-testid="keyword-search-input"]')
      .shadow()
      .find('[id="va-search-button"]')
      .click();
  };

  // This method verifies the highlighted text in the messages returned after clicking the search button.

  verifyHighlightedText = text => {
    cy.get('[data-testid="highlighted-text"]').should('contain', text);
  };

  // This method selects the folder from the drop down menu.

  selectMessagesFolder = name => {
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select(`${name}`, { force: true });
  };

  // retrieveMessages = function (folderID) {
  //   folderInfo.data.attributes.folderId = folderID;
  //   cy.intercept(
  //     'GET',
  //     `/my_health/v1/messaging/folders/${folderID}/messages?per_page=1`,
  //     mockMessages,
  //   ).as('basicSearchInboxRequest');
  // }
}
export default PatientBasicSearchPage;
