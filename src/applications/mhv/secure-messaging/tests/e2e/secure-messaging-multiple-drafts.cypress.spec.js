import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
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

  it('verify headers', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.get('[data-testid="reply-form"]')
      .find('h2')
      .should('be.visible')
      .and('contain.text', '4 drafts');

    cy.get('[data-testid="reply-form"]')
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft');
      });
  });

  it('verify draft could be re-saved', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);

    draftPage.saveDraft(mockMultiDraftsResponse.data[0]);
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ waitForAnimations: true });

    cy.get('.last-save-time > .vads-u-margin-y--0').should(
      'include.text',
      'Your message was saved ',
    );
  });

  it('verify draft could be send', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);

    draftPage.replyDraft(
      mockMultiDraftsResponse.data[0],
      mockMultiDraftsResponse.data[0].attributes.messageId,
    );

    draftPage.verifyConfirmationMessage(Alerts.Message.SEND_MESSAGE_SUCCESS);
  });

  it('verify draft could be deleted', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);

    draftPage.deleteDraft(
      mockMultiDraftsResponse.data[0],
      mockMultiDraftsResponse.data[0].attributes.messageId,
    );
    draftPage.verifyConfirmationMessage(Alerts.Message.DELETE_DRAFT_SUCCESS);
  });

  it('verify managing drafts', () => {
    landingPage.loadSingleThread(mockMultiDraftsResponse);

    cy.get('[data-testid="message-body-field"]').should(
      'have.attr',
      'value',
      mockMultiDraftsResponse.data[0].attributes.body,
    );

    cy.contains('Edit draft').click({ waitForAnimations: true });
    cy.get('[data-testid="message-body-field"]').should(
      'have.attr',
      'value',
      mockMultiDraftsResponse.data[1].attributes.body,
    );
  });
});
