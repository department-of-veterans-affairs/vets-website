import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from './fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  it('verify headers', () => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread();
    const draftsCount = mockMultiDraftsResponse.data.filter(
      el => el.attributes.draftDate !== null,
    ).length;

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    // assertion will be added here

    cy.get('[data-testid="reply-form"]')
      .find('h2')
      .should('be.visible')
      .and('contain.text', `${draftsCount} drafts`);

    cy.get('[data-testid="reply-form"]')
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft');
      });

    cy.get('[class="vads-u-margin-top--0 vads-u-margin-bottom--3"]').each(
      el => {
        cy.wrap(el).should('include.text', 'edited');
      },
    );

    cy.log('Privet');
  });
});
