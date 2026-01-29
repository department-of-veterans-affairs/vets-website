import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/threads-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    SecureMessagingSite.login();
    const date = new Date();
    date.setDate(date.getDate() - 2);
    PatientInboxPage.loadInboxMessages(inboxMessages);
    cy.get(Locators.MES_COUNT).should($msgCount => {
      expect($msgCount.first()).to.contain(
        inboxMessages.data.at(0).attributes.messageCount,
      );
    });
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
