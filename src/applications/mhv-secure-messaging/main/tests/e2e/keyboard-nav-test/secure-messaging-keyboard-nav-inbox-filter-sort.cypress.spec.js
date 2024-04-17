import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { Paths } from '../utils/constants';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';

describe('Keyboard Navigation for Filter & Sort functionalities', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('Verify filter works correctly', () => {
    cy.tabToElement('#inputField')
      .first()
      .type('test', { force: true });
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/search`,
      inboxFilterResponse,
    ).as('filterResult');

    cy.realPress('Enter');
    // TODO add filtered list assertion
  });

  it('Verify clear filter btn works correctly', () => {
    cy.tabToElement('#inputField')
      .first()
      .type('test', { force: true });
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/search`,
      inboxFilterResponse,
    ).as('filterResult');

    cy.realPress('Enter');
    cy.realPress(['ShiftLeft', 'Tab']);
    cy.realPress('Enter');
    // TODO add empty field assertion
  });

  it('verify sorting works properly', () => {
    // TODO add test and assertions
  });
});
