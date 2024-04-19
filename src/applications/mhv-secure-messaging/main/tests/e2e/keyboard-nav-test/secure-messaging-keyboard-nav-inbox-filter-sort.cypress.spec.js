import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Keyboard Navigation for Filter & Sort functionalities', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });

  it('Verify filter works correctly', () => {
    landingPage.inputFilterDataByKeyboard('test');
    landingPage.submitFilterByKeyboard(filteredData);
    landingPage.verifyFilterResults('test', filteredData);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    landingPage.inputFilterDataByKeyboard('test');
    landingPage.submitFilterByKeyboard(filteredData);
    landingPage.clearFilterByKeyboard();
    landingPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const testData = { ...inboxFilterResponse };
    testData.data.sort(
      (a, b) =>
        new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
    );

    landingPage.verifySortingByKeyboard('Oldest to newest', testData);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
