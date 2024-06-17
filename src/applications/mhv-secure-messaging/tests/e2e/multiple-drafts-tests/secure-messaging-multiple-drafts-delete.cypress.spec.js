import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('verify delete functionality of multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
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
    PatientInboxPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify user can delete second draft', () => {
    // delete recent draft
    cy.get('#delete-draft-button').click({ force: true });

    // intercept delete draft api call
    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${
        updatedMultiDraftResponse.data[0].attributes.messageId
      }`,
      updatedMultiDraftResponse.data[0],
    ).as('deletedDraftResponse');

    // delete recent msg from thread
    const reducedMultiDraftReponse = { ...updatedMultiDraftResponse };
    reducedMultiDraftReponse.data.splice(0, 1);

    // intercept get updates messages thread api call
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        updatedMultiDraftResponse.data[1].attributes.messageId
      }/thread?*`,
      reducedMultiDraftReponse,
    ).as('updatedThreadResponse');

    // confirm delete draft
    cy.get('#delete-draft').click({ force: true });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
