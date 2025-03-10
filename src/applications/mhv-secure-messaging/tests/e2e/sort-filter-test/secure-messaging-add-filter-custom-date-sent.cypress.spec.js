import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import PatientFilterPage from '../pages/PatientFilterPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatentMessageSentPage from '../pages/PatientMessageSentPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM SENT ADD FILTER CUSTOM DATE RANGE', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatentMessageSentPage.loadMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectDateRange('Custom');
  });

  it('verify advanced filter form elements', () => {
    PatientFilterPage.verifyStartDateFormElements();
    PatientFilterPage.verifyEndDateFormElements();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify month and day range', () => {
    PatientFilterPage.verifyMonthFilterRange(14);
    PatientFilterPage.verifyDayFilterRange(2);

    PatientFilterPage.selectStartMonth(`February`);
    PatientFilterPage.verifyDayFilterRange(31);

    PatientFilterPage.selectStartMonth(`June`);
    PatientFilterPage.verifyDayFilterRange(32);

    PatientFilterPage.selectStartMonth(`October`);
    PatientFilterPage.verifyDayFilterRange(33);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify errors`, () => {
    cy.get(Locators.BUTTONS.FILTER).click();

    cy.get(Locators.FROM_TO_DATES_CONTAINER)
      .find('legend')
      .eq(0)
      .should('have.text', 'Start date (*Required)');

    cy.get(Locators.FROM_TO_DATES_CONTAINER)
      .find('legend')
      .eq(1)
      .should('have.text', 'End date (*Required)');

    PatientFilterPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_START_DATE,
    ).should(`have.text`, Alerts.DATE_FILTER.EMPTY_START_DATE);

    PatientFilterPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_END_DATE,
    ).should(`have.text`, Alerts.DATE_FILTER.EMPTY_END_DATE);

    PatientFilterPage.selectStartMonth('April');
    PatientFilterPage.selectEndMonth('February');
    cy.get(Locators.BUTTONS.FILTER).click();

    PatientFilterPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_START_DATE,
    ).should(`include.text`, Alerts.DATE_FILTER.INVALID_START_DATE);

    PatientFilterPage.getRequiredFieldError(
      Locators.BLOCKS.FILTER_END_DATE,
    ).should(`include.text`, Alerts.DATE_FILTER.INVALID_END_DATE);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filters button', () => {
    PatientFilterPage.selectStartMonth(`February`);
    PatientFilterPage.selectStartDay(`2`);
    PatientFilterPage.selectEndMonth('April');
    PatientFilterPage.selectEndDay(`11`);
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
    const searchResultResponse = PatientFilterPage.createDateFilterMockResponse(
      2,
      1,
    );

    const { year, startMonth, endMonth } = GeneralFunctionsPage.getParsedDate(
      new Date(),
    );

    PatientFilterPage.selectStartMonth(startMonth);
    PatientFilterPage.selectStartDay(`1`);
    PatientFilterPage.getStartYear(year);
    PatientFilterPage.selectEndMonth(endMonth);
    PatientFilterPage.selectEndDay(`11`);
    PatientFilterPage.getEndYear(year);

    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientFilterPage.verifyFilterResponseLength(searchResultResponse);
    PatientFilterPage.verifyMessageDate(2);
    PatientFilterPage.verifyFilterMessageLabel(
      searchResultResponse,
      `${startMonth} 1st ${year} to ${endMonth} 11th ${year}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
