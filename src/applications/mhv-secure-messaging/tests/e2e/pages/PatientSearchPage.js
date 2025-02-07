import mockMessageResponse from '../fixtures/drafts-search-results.json';
import folderResponse from '../fixtures/folder-response.json';
import { Locators, Paths } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import GeneralFunctionsPage from './GeneralFunctionsPage';

class PatientSearchPage {
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

  createCategorySearchMockResponse = (
    numberOfMessages,
    category,
    originalResponse,
  ) => {
    return {
      data: originalResponse.data.slice(0, numberOfMessages).map(item => {
        // deep copy of each item
        const newItem = JSON.parse(JSON.stringify(item));
        // update the category to provided data
        newItem.type = 'messages';
        newItem.attributes.readReceipt = null;
        newItem.attributes.category = category;
        return newItem;
      }),
    };
  };

  createDateSearchMockResponse = (
    numberOfMessages,
    numberOfMonths,
    originalResponse = mockMessages,
  ) => {
    return {
      data: originalResponse.data.slice(0, numberOfMessages).map(item => {
        const newItem = { ...item };
        newItem.type = 'messages';
        newItem.attributes = {
          ...newItem.attributes,
          sentDate: GeneralFunctionsPage.getRandomDateWithinLastNumberOfMonths(
            numberOfMonths,
          ),
          readReceipt: null,
        };
        return newItem;
      }),
    };
  };

  verifySearchResponseLength = mockResponse => {
    cy.get(Locators.MESSAGES).should('have.length', mockResponse.data.length);
  };

  verifySearchResponseCategory = name => {
    cy.get(Locators.MESSAGES).should('contain', name);
  };

  verifySearchMessageLabel = (response, text) => {
    cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
      .should('contain', response.data.length)
      .and('contain', text);
  };

  verifyMessageDate = numberOfMonth => {
    cy.get(`.received-date`).each(message => {
      cy.wrap(message)
        .invoke('text')
        .then(dateString => {
          // extract and parse the date
          const extractedDate = dateString.split(' at ')[0]; // "November 29, 2024"
          const parsedDate = new Date(extractedDate);

          // calculate a few months back from the current date
          const backDate = new Date();
          backDate.setMonth(backDate.getMonth() - numberOfMonth);

          // assert the date is within the last 3 months
          expect(parsedDate).to.be.gte(backDate);
        });
    });
  };

  verifyStartDateFormElements = () => {
    cy.get(Locators.BLOCKS.FILTER_START_DATE, { includeShadowDom: true })
      .find(`.required`)
      .should(`be.visible`)
      .and(`have.text`, `(*Required)`);

    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .shadow()
      .find(`.select-month`)
      .should(`be.visible`);
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .shadow()
      .find(`.select-day`)
      .should(`be.visible`);
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .shadow()
      .find(`.input-year`)
      .should(`be.visible`);
  };

  verifyEndDateFormElements = () => {
    cy.get(Locators.BLOCKS.FILTER_END_DATE, { includeShadowDom: true })
      .find(`.required`)
      .should(`be.visible`)
      .and(`have.text`, `(*Required)`);

    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .shadow()
      .find(`.select-month`)
      .should(`be.visible`);
    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .shadow()
      .find(`.select-day`)
      .should(`be.visible`);
    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .shadow()
      .find(`.input-year`)
      .should(`be.visible`);
  };

  verifyMonthFilterRange = number => {
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .find(`[name="discharge-dateMonth"]`)
      .find(`option`)
      .should(`have.length`, number);
  };

  verifyDayFilterRange = number => {
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .find(`[name="discharge-dateDay"]`)
      .find(`option`)
      .should(`have.length`, number);
  };

  selectStartMonth = month => {
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .find(`[name="discharge-dateMonth"]`)
      .select(month);
  };

  selectEndMonth = month => {
    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .find(`[name="discharge-dateMonth"]`)
      .select(month);
  };

  selectStartDay = day => {
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .find(`[name="discharge-dateDay"]`)
      .select(day);
  };

  selectEndDay = day => {
    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .find(`[name="discharge-dateDay"]`)
      .select(day);
  };

  getStartYear = year => {
    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .find(`[name="discharge-dateYear"]`)
      .type(year);
  };

  getEndYear = year => {
    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .find(`[name="discharge-dateYear"]`)
      .type(year);
  };

  getRequiredFieldError = selector => {
    return cy
      .get(selector)
      .find(`#error-message`)
      .should(`be.visible`);
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

export default new PatientSearchPage();
