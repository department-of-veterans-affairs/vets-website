import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';

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
    landingPage.submitFilerByKeyboard(filteredData);
    landingPage.verifyFilterResults('test', filteredData);
  });

  it('Verify clear filter btn works correctly', () => {
    landingPage.inputFilterDataByKeyboard('test');
    landingPage.submitFilerByKeyboard(filteredData);
    landingPage.clearFilterByKeyboard();
    landingPage.verifyFilterFieldCleared();
  });

  it('verify sorting works properly', () => {
    // TODO add test and assertions
  });
});
