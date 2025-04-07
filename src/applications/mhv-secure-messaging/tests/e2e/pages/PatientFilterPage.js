import mockMessageResponse from '../fixtures/drafts-search-results.json';
import { Locators, Paths } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import GeneralFunctionsPage from './GeneralFunctionsPage';

class PatientFilterSortPage {
  // This method clicks the Search messages on the side navigation bar.
  clickFilterMessageButton = () => {
    cy.get(Locators.BUTTONS.FILTER).click();
  };

  openAdditionalFilter = () => {
    cy.get(Locators.BUTTONS.ADDITIONAL_FILTER).click();
  };

  // This method will access the input field and enters the text that will be used for search.
  typeFilterInputFieldText = text => {
    cy.get(Locators.KEYWORD_SEARCH)
      .shadow()
      .find('[id="inputField"]')
      .type(text, { force: true });
  };

  // This method select date range
  selectDateRange = dropDownValue => {
    cy.get(Locators.FIELDS.DATE_RANGE_DROPDOWN)
      .find('select')
      .select(dropDownValue);
  };

  // This method clicks the Filter button and load filtered data.

  clickApplyFilterButton = mockFilterResponse => {
    cy.intercept(
      'POST',
      Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
      mockFilterResponse,
    ).as('filterResult');
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
    cy.wait('@filterResult');
  };

  verifyFilterCategoryDropdown = data => {
    cy.get(Locators.FIELDS.CATEGORY_OPTION).each(option => {
      cy.wrap(option)
        .invoke('text')
        .then(el => {
          expect(el.toUpperCase()).to.be.oneOf(data);
        });
    });
  };

  verifyFilterDateRangeDropdown = data => {
    cy.get(Locators.FIELDS.DATE_RANGE_OPTION).each(option => {
      cy.wrap(option)
        .invoke('text')
        .then(el => {
          expect(el.toUpperCase()).to.be.oneOf(data);
        });
    });
  };

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

  selectAdvancedSearchCategory = text => {
    cy.get(Locators.FIELDS.CATEGORY_DROPDOWN)
      .find('select')
      .select(text, { force: true });
  };
  // This method selects the folder from the dropdown menu.

  selectMessagesFolder = name => {
    cy.get(Locators.FOLDERS.FOLDER_DROPDOWN)
      .shadow()
      .find('select')
      .select(`${name}`, { force: true });
  };

  createCategoryFilterMockResponse = (
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

  createDateFilterMockResponse = (
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

  verifyFilterResponseLength = mockResponse => {
    cy.get(Locators.MESSAGES).should('have.length', mockResponse.data.length);
  };

  verifyFilterResponseCategory = name => {
    cy.get(Locators.MESSAGES).should('contain', name);
  };

  verifyFilterMessageLabel = (response, text) => {
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

export default new PatientFilterSortPage();
