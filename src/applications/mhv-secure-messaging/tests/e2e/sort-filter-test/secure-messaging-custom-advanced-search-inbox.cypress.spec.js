import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
// import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
// import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM INBOX ADVANCED CUSTOM DATE RANGE SEARCH', () => {
  // let searchResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectDateRange('Custom');
  });

  it('verify advanced filter form elements', () => {
    cy.get(`[data-testid="date-start"]`, { includeShadowDom: true })
      .find(`.required`)
      .should(`be.visible`)
      .and(`have.text`, `(*Required)`);

    cy.get(`[data-testid="date-end"]`, { includeShadowDom: true })
      .find(`.required`)
      .should(`be.visible`)
      .and(`have.text`, `(*Required)`);

    cy.get(`[data-testid="date-start"]`)
      .shadow()
      .find(`.select-month`)
      .should(`be.visible`);
    cy.get(`[data-testid="date-start"]`)
      .shadow()
      .find(`.select-day`)
      .should(`be.visible`);
    cy.get(`[data-testid="date-start"]`)
      .shadow()
      .find(`.input-year`)
      .should(`be.visible`);

    cy.get(`[data-testid="date-end"]`)
      .shadow()
      .find(`.select-month`)
      .should(`be.visible`);
    cy.get(`[data-testid="date-end"]`)
      .shadow()
      .find(`.select-day`)
      .should(`be.visible`);
    cy.get(`[data-testid="date-end"]`)
      .shadow()
      .find(`.input-year`)
      .should(`be.visible`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify month and day range', () => {
    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateMonth"]`)
      .find(`option`)
      .should(`have.length`, 14);
    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateDay"]`)
      .find(`option`)
      .should(`have.length`, 2);

    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateMonth"]`)
      .select(`February`);
    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateDay"]`)
      .find(`option`)
      .should(`have.length`, 31);

    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateMonth"]`)
      .select(`June`);
    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateDay"]`)
      .find(`option`)
      .should(`have.length`, 32);

    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateMonth"]`)
      .select(`October`);
    cy.get(`[data-testid="date-start"]`)
      .find(`[name="discharge-dateDay"]`)
      .find(`option`)
      .should(`have.length`, 33);

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
