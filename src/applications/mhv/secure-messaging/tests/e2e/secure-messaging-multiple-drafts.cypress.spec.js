import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockMultiDraftsResponse from './fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadSingleThread(mockMultiDraftsResponse);
  });

  it('verify draft could be send', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it.skip('verify drafts could be deleted', () => {
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

    draftPage.verifyDeleteConfirmationMessage();
  });
});
