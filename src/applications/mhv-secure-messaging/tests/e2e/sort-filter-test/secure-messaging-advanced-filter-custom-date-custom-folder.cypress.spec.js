import { format, subMonths } from 'date-fns';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import PatientSearchPage from '../pages/PatientSearchPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';

describe('SM INBOX ADVANCED CUSTOM DATE RANGE SEARCH', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
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

    PatientSearchPage.selectStartMonth(`February`);
    PatientSearchPage.verifyDayFilterRange(31);

    PatientSearchPage.selectStartMonth(`June`);
    PatientSearchPage.verifyDayFilterRange(32);

    PatientSearchPage.selectStartMonth(`October`);
    PatientSearchPage.verifyDayFilterRange(33);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify errors`, () => {
    cy.get(Locators.BUTTONS.FILTER).click();

    PatientSearchPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_START_DATE,
    ).should(`have.text`, Alerts.DATE_FILTER.EMPTY_START_DATE);

    PatientSearchPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_END_DATE,
    ).should(`have.text`, Alerts.DATE_FILTER.EMPTY_END_DATE);

    PatientSearchPage.selectStartMonth('April');
    PatientSearchPage.selectEndMonth('February');
    cy.get(Locators.BUTTONS.FILTER).click();

    PatientSearchPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_START_DATE,
    ).should(`include.text`, Alerts.DATE_FILTER.INVALID_START_DATE);

    PatientSearchPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_END_DATE,
    ).should(`include.text`, Alerts.DATE_FILTER.INVALID_END_DATE);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filters button', () => {
    PatientSearchPage.selectStartMonth(`February`);
    PatientSearchPage.selectStartDay(`2`);
    PatientSearchPage.selectEndMonth('April');
    PatientSearchPage.selectEndDay(`11`);
    cy.get(Locators.CLEAR_FILTERS).click();
    cy.get(Locators.FIELDS.DATE_RANGE_OPTION).should(
      `have.attr`,
      `value`,
      `any`,
    );
    cy.get(Locators.BLOCKS.FILTER_START_DATE).should(`not.exist`);
    cy.get(Locators.BLOCKS.FILTER_END_DATE).should(`not.exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify search results', () => {
    const searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      2,
      1,
    );
    const currentYear = format(new Date(), 'yyyy');
    const startMonth = format(subMonths(new Date(), 2), 'MMMM');
    const endMonth = format(new Date(), 'MMMM');

    PatientSearchPage.selectStartMonth(startMonth);
    PatientSearchPage.selectStartDay(`1`);
    PatientSearchPage.getStartYear(currentYear);
    PatientSearchPage.selectEndMonth(endMonth);
    PatientSearchPage.selectEndDay(`11`);
    PatientSearchPage.getEndYear(currentYear);

    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(2);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      `${startMonth} 1st ${currentYear} to ${endMonth} 11th ${currentYear}`,
    );
  });
});
