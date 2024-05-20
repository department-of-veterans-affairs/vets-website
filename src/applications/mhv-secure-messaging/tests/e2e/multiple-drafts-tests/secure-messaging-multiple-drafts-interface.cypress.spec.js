import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
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

  it('verify headers', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get('.page-title').should(
      'contain.text',
      `${updatedMultiDraftResponse.data[0].attributes.subject}`,
    );
    cy.get('#draft-reply-header').should('have.text', 'Drafts');

    cy.get(Locators.REPLY_FORM)
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft');
      });
  });

  it('verify drafts detailed view', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get('[data-testid="edit-draft-button-body-text"]').click({
      force: true,
      waitForAnimations: true,
    });
    cy.get('[subheader*="draft"]')
      .shadow()
      .find('button')
      .should('have.attr', 'aria-expanded', 'true');
    cy.get('[data-testid="edit-draft-button-body-text"]').click({
      force: true,
      waitForAnimations: true,
    });
    cy.get('[subheader*="draft"]')
      .shadow()
      .find('button')
      .should('have.attr', 'aria-expanded', 'false');

    cy.get('[subheader="multi-draft #2..."]')
      .shadow()
      .find('button')
      .click({ force: true, waitForAnimations: true });
  });
});
