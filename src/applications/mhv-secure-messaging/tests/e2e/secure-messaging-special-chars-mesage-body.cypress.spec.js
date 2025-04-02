import threadResponse from './fixtures/thread-response-new-api.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM MESSAGE BODY SPECIAL CHARACTERS', () => {
  const updatedResponce = threadResponse;
  const expectedBody = `&**)()_+<>?||""&#;"<""`;
  it('verify special characters decoded', () => {
    updatedResponce.data[0].attributes.body = `&amp;amp;**)()_+&amp;lt;&amp;gt;?||&amp;quot;&amp;quot;&amp;amp;#;&amp;quot;&amp;lt;&amp;quot;&#x22;`;
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedResponce);

    cy.get(`[data-testid="message-body-${updatedResponce.data[0].id}"]`).should(
      `have.text`,
      expectedBody,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
