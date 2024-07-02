import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const draftPage = new PatientMessageDraftsPage();

  const updatedMultiDraftResponse = GeneralFunctionsPage.updatedThreadDates(
    mockMultiDraftsResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify headers', () => {
    const draftsCount = updatedMultiDraftResponse.data.filter(
      el => el.attributes.draftDate !== null,
    ).length;

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.REPLY_FORM)
      .find('h2')
      .should('be.visible')
      .and('contain.text', `${draftsCount} drafts`);

    cy.get(Locators.REPLY_FORM)
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft');
      });

    cy.get(Locators.ALERTS.LAST_EDIT_DATE).each(el => {
      cy.wrap(el).should('include.text', 'edited');
    });
  });

  it('verify drafts detailed view', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.verifyMessagesBodyText(
      updatedMultiDraftResponse.data[0].attributes.body,
    );

    cy.get(Locators.ALERTS.EDIT_DRAFT).click();
    draftPage.verifyMessagesBodyText(
      updatedMultiDraftResponse.data[1].attributes.body,
    );
    draftPage.verifyDraftMessageBodyText(
      updatedMultiDraftResponse.data[0].attributes.body,
    );

    cy.get('[text="Edit draft 2"]').click();
    draftPage.verifyMessagesBodyText(
      updatedMultiDraftResponse.data[0].attributes.body,
    );
    draftPage.verifyDraftMessageBodyText(
      updatedMultiDraftResponse.data[1].attributes.body,
    );
  });
});
