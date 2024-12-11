import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSearchMessages from '../fixtures/searchResponses/search-COVID-results.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientBasicSearchPage from '../pages/PatientBasicSearchPage';

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
  let searchResultResponse;

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    searchResultResponse = PatientBasicSearchPage.createSearchMockResponse(
      2,
      3,
    );
    cy.log(JSON.stringify(searchResultResponse.data[0]));
    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
    cy.get(Locators.MESSAGES).should(
      'have.length',
      searchResultResponse.data.length,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 6 month', () => {
    searchResultResponse = PatientBasicSearchPage.createSearchMockResponse(
      3,
      6,
    );
    cy.log(JSON.stringify(searchResultResponse.data[1]));
    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
    cy.get(Locators.MESSAGES).should(
      'have.length',
      searchResultResponse.data.length,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 12 month', () => {
    searchResultResponse = PatientBasicSearchPage.createSearchMockResponse(
      5,
      12,
    );
    cy.log(JSON.stringify(searchResultResponse.data[4]));
    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
    cy.get(Locators.MESSAGES).should(
      'have.length',
      searchResultResponse.data.length,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
