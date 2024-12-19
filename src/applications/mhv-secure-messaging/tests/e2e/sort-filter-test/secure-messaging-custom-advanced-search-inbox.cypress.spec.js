import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
// import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM INBOX ADVANCED CUSTOM DATE RANGE SEARCH', () => {
  // let searchResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectDateRange('Custom');
  });

  it('verify advanced filter form elements', () => {
    PatientSearchPage.verifyStartDateFormElements();
    PatientSearchPage.verifyEndDateFormElements();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify month and day range', () => {
    PatientSearchPage.verifyMonthFilterRange(14);
    PatientSearchPage.verifyDayFilterRange(2);

    PatientSearchPage.selectAdvancedFilterMonth(`February`);
    PatientSearchPage.verifyDayFilterRange(31);

    PatientSearchPage.selectAdvancedFilterMonth(`June`);
    PatientSearchPage.verifyDayFilterRange(32);

    PatientSearchPage.selectAdvancedFilterMonth(`October`);
    PatientSearchPage.verifyDayFilterRange(33);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify errors`, () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter results', () => {
    // searchResultResponse = PatientSearchPage.createDateSearchMockResponse(2, 3);
    // PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
    //
    // PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    // PatientSearchPage.verifyMessageDate(3);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filters button', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
