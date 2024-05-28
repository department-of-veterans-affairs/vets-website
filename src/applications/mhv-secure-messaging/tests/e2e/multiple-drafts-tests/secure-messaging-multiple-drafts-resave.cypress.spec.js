import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Data } from '../utils/constants';
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

  it('verify first draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.expandSingleDraft(2);

    cy.get('[data-testid="message-body-field-2"]')
      .shadow()
      .find('#input-type-textarea')
      .type('\n\nnewText', { force: true });

    draftPage.saveMultiDraftMessage(
      updatedMultiDraftResponse.data[0],
      updatedMultiDraftResponse.data[0].attributes.messageId,
      2,
    );

    draftPage.verifySavedMessageAlertText(Data.MESSAGE_WAS_SAVED);
  });

  it('verify second draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.expandSingleDraft(1);

    cy.get('[data-testid="message-body-field-1"]')
      .shadow()
      .find('#input-type-textarea')
      .type('\n\nnewText', { force: true });

    draftPage.saveMultiDraftMessage(
      updatedMultiDraftResponse.data[1],
      updatedMultiDraftResponse.data[1].attributes.messageId,
      1,
    );

    draftPage.verifySavedMessageAlertText(Data.MESSAGE_WAS_SAVED);
  });
});
