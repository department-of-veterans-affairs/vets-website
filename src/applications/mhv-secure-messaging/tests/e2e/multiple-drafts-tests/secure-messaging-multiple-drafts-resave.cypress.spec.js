import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('re-save multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  const updateDates = data => {
    const currentDate = new Date();
    return {
      ...data,
      data: data.data.map((item, i) => {
        const newSentDate = new Date(currentDate);
        const newDraftDate = new Date(currentDate);
        newSentDate.setDate(currentDate.getDate() - i);
        newDraftDate.setDate(currentDate.getDate() - i);
        return {
          ...item,
          attributes: {
            ...item.attributes,
            sentDate:
              item.attributes.sentDate != null
                ? newSentDate.toISOString()
                : null,
            draftDate:
              item.attributes.draftDate != null
                ? newDraftDate.toISOString()
                : null,
          },
        };
      }),
    };
  };

  const updatedMultiDraftResponse = updateDates(mockMultiDraftsResponse);

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  // TODO below tests have to be refactored after a11ly error fixing

  it.skip('verify first draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    draftPage.expandSingleDraft(2);
    cy.get('[value="multi-draft #2"]')
      .shadow()
      .find('textarea')
      .clear()
      .type('newText', { force: true });

    // draftPage.saveMultiDraftMessage(
    //   updatedMultiDraftResponse.data[0],
    //   updatedMultiDraftResponse.data[0].attributes.messageId, 2
    // );

    // draftPage.verifySavedMessageAlertText(Data.MESSAGE_WAS_SAVED);
  });

  it.skip('verify second draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.expandSingleDraft(1);
    cy.get('[value="multi-draft #1"]')
      .shadow()
      .find('textarea')
      .clear()
      .type('newText', { force: true });
    // draftPage.saveMultiDraftMessage(
    //   updatedMultiDraftResponse.data[1],
    //   updatedMultiDraftResponse.data[1].attributes.messageId,
    // );
    //
    // draftPage.verifySavedMessageAlertText(Data.MESSAGE_WAS_SAVED);
    // landingPage.verifyNotForPrintHeaderText();
  });
});
