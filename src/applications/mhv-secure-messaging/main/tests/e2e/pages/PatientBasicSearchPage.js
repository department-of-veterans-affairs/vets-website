import mockMessageResponse from '../fixtures/drafts-search-results.json';
import folderResponse from '../fixtures/folder-response.json';
import { Locators, Paths } from '../utils/constants';

class PatientBasicSearchPage {
  // This method clicks the Search messages on the side navigation bar.
  clickSearchMessageButton = () => {
    cy.get(Locators.BUTTONS.FILTER).click();
  };

  // This method will access the input field and enters the text that will be used for search.

  typeSearchInputFieldText = text => {
    cy.get(Locators.KEYWORD_SEARCH)
      .shadow()
      .find('[id="inputField"]')
      .type(text, { force: true });
  };

  // This method clicks the Filter button on the Inbox page.
  clickInboxSearchButton = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${
        folderResponse.data.at(0).attributes.folderId
      }/search`,
      mockMessageResponse,
    ).as('inboxSearchResults');
    this.clickSearchMessageButton();
  };

  clickDraftSearchButton = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${
        folderResponse.data.at(1).attributes.folderId
      }/search`,
      mockMessageResponse,
    ).as('DraftSearchResults');
    this.clickSearchMessageButton();
  };

  clickCustomFolderSearchButton = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${
        folderResponse.data.at(4).attributes.folderId
      }/search`,
      mockMessageResponse,
    ).as('CustomSearchResults');
    this.clickSearchMessageButton();
  };

  // This method verifies the highlighted text in the messages returned after clicking the search button.

  verifyHighlightedText = text => {
    cy.get(Locators.ALERTS.HIGHLIGHTED).should('contain', text);
  };

  loadInboxSearchResults = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/search`,
      mockMessageResponse,
    ).as('inboxSearchResults');
  };
  // This method selects the folder from the drop down menu.

  selectMessagesFolder = name => {
    cy.get(Locators.FOLDERS.FOLDER_DROPDOWN)
      .shadow()
      .find('select')
      .select(`${name}`, { force: true });
  };

  // retrieveMessages = function (folderID) {
  //   folderInfo.data.attributes.folderId = folderID;
  //   cy.intercept(
  //     'GET',
  //     `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderID}/messages?per_page=1`,
  //     mockMessages,
  //   ).as('basicSearchInboxRequest');
  // }
}

export default new PatientBasicSearchPage();
