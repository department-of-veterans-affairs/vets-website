import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSearchMessages from '../fixtures/searchResponses/search-COVID-results.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';

describe('SM INBOX ADVANCED CATEGORY SEARCH', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('COVID');
    PatientInboxPage.clickFilterMessagesButton(mockSearchMessages);
  });

  it('verify all inbox messages contain the searched category', () => {
    cy.get(Locators.MESSAGES)
      .should('contain', 'COVID')
      .and('have.length', mockSearchMessages.data.length);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
      .should('contain', '4')
      .and('contain', 'Category: "COVID"');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM INBOX ADVANCED DATE SEARCH', () => {
  function getRandomDateWithinLastThreeMonths() {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const randomTime =
      threeMonthsAgo.getTime() +
      Math.random() * (now.getTime() - threeMonthsAgo.getTime());
    return new Date(randomTime).toISOString();
  }

  // Create the new object
  const newObject = {
    data: mockMessages.data.slice(0, 2).map(item => {
      const newItem = { ...item };
      newItem.attributes = {
        ...newItem.attributes,
        sentDate: getRandomDateWithinLastThreeMonths(),
      };
      return newItem;
    }),
  };
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();

    cy.log(JSON.stringify(newObject));
  });

  it('verify filter by last 3 month', () => {
    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(newObject);
    // cy.intercept(
    //   'POST',
    //   Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
    //   mockSearchMessages,
    // );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
