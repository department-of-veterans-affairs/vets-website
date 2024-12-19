import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
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
    cy.get(`[data-testid="date-start"]`)
      .find(`#error-message`)
      .should(`be.visible`)
      .and(`have.text`, `Error Please enter a start date.`);
    cy.get(`[data-testid="date-end"]`)
      .find(`#error-message`)
      .should(`be.visible`)
      .and(`have.text`, `Error Please enter an end date.`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filters button', () => {
    PatientSearchPage.selectStartMonth(`February`);
    PatientSearchPage.selectStartDay(`2`);
    PatientSearchPage.selectEndMonth('April');
    PatientSearchPage.selectEndDay(`11`);
    cy.get(Locators.CLEAR_FILTERS).click();
    cy.get(`[data-testid="date-range-dropdown"]`).should(
      `have.attr`,
      `value`,
      `any`,
    );
    cy.get(`[data-testid="date-start"]`).should(`not.exist`);
    cy.get(`[data-testid="date-end"]`).should(`not.exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
