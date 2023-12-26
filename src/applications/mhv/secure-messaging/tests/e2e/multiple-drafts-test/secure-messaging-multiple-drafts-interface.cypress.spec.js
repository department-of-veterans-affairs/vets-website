import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread();
  });

  it('verify headers', () => {
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

    cy.get('[data-testid="reply-form"]')
      .find('h2')
      .should('be.visible')
      .and('contain.text', `${draftsCount} drafts`);

    cy.get('[data-testid="reply-form"]')
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft');
      });

    cy.get('[data-testid="last-edit-date"]').each(el => {
      cy.wrap(el).should('include.text', 'edited');
    });
  });

  it('verify drafts detailed vew', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('[data-testid="message-body-field"]')
      .should('have.attr', 'value')
      .and('eq', mockMultiDraftsResponse.data[0].attributes.body);

    cy.get('[text="Edit draft 1"]').click();
    cy.get('[data-testid="message-body-field"]')
      .should('have.attr', 'value')
      .and('eq', mockMultiDraftsResponse.data[1].attributes.body);

    cy.get('.message-body-draft-preview').should(
      'have.text',
      `${mockMultiDraftsResponse.data[0].attributes.body}`,
    );

    cy.get('[text="Edit draft 2"]').click();
    cy.get('[data-testid="message-body-field"]')
      .should('have.attr', 'value')
      .and('eq', mockMultiDraftsResponse.data[0].attributes.body);

    cy.get('.message-body-draft-preview').should(
      'have.text',
      `${mockMultiDraftsResponse.data[1].attributes.body}`,
    );
  });
});
