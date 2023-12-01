import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import mockMultiDraftsResponse from './fixtures/draftsResponse/multi-draft-response.json';
import { Alerts } from '../../util/constants';

describe('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });

  it('verify multiple drafts could be created', () => {});

  it('verify draft could be send', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE}/messages/${
        mockMultiDraftsResponse.data[0].attributes.messageId
      }/reply`,
      { data: mockMultiDraftsResponse.data[0] },
    ).as('sentDraftResponse');
    cy.get(Locators.BUTTONS.SEND).click({ force: true });
    cy.wait('@sentDraftResponse');

    draftPage.verifyConfirmationMessage(Alerts.Message.SEND_MESSAGE_SUCCESS);
  });

  it('verify drafts could be deleted', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/messages/${
        mockMultiDraftsResponse.data[0].attributes.messageId
      }`,
      { data: mockMultiDraftsResponse.data[0] },
    ).as('deletedDraftResponse');

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ waitForAnimations: true });
    cy.get('[text="Delete draft"]').click({ waitForAnimations: true });

    draftPage.verifyConfirmationMessage(Alerts.Message.DELETE_DRAFT_SUCCESS);
  });
});
