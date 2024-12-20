import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM INBOX ADVANCED CUSTOM DATE RANGE SEARCH', () => {
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

    // TODO create a method to get an error

    cy.get(Locators.BLOCKS.FILTER_START_DATE)
      .find(`#error-message`)
      .should(`be.visible`)
      .and(`have.text`, Alerts.DATE_FILTER.EMPTY_START_DATE);

    cy.get(Locators.BLOCKS.FILTER_END_DATE)
      .find(`#error-message`)
      .should(`be.visible`)
      .and(`have.text`, Alerts.DATE_FILTER.EMPTY_END_DATE);

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
});
