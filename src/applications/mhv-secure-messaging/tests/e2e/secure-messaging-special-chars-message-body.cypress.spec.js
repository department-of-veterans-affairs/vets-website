import threadResponse from './fixtures/thread-response-new-api.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import PatientComposePage from './pages/PatientComposePage';
import newDraft from './fixtures/draftsResponse/drafts-single-message-response.json';

describe('SM MESSAGE BODY SPECIAL CHARACTERS', () => {
  const expectedBody = `&**)()_+<>?||""&#;"<""`;
  const responseBody = `&amp;**)()_+&lt;&gt;?||&quot;&quot;&amp;#;&quot;&lt;&quot;&#x22;`;
  it('verify special characters decoded', () => {
    const updatedResponse = { ...threadResponse };
    updatedResponse.data[0].attributes.body = responseBody;
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedResponse);

    cy.get(`[data-testid="message-body-${updatedResponse.data[0].id}"]`).should(
      `have.text`,
      expectedBody,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify special characters decoded when saving new draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory('OTHER');
    PatientComposePage.getMessageSubjectField().type(`test subject`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().clear().type(expectedBody, {
      force: true,
    });
    const draftResponse = { ...newDraft };
    draftResponse.data.attributes.body = responseBody;
    PatientComposePage.saveNewDraft('OTHER', 'test subject');
    cy.get(Locators.ALERTS.SAVE_DRAFT).should('contain', 'message was saved');

    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY)
      .shadow()
      .find('textarea')
      .should(`have.value`, expectedBody);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
