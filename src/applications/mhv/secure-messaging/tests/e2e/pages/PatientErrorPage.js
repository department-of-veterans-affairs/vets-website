import { Paths, Alerts } from '../utils/constants';

class PatienErrorPage {
  loadParticularFolderError = () => {
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/*`, {
      errors: [
        {
          title: 'Service unavailable',
          detail: Alerts.OUTAGE,
          status: '503',
        },
      ],
    }).as('inboxFolderMetaData');

    cy.visit(Paths.UI_MAIN + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadMyFoldersError = () => {
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}*`, {
      errors: [
        {
          title: 'Service unavailable',
          detail: Alerts.OUTAGE,
          status: '503',
        },
      ],
    }).as('folders');

    cy.visit(Paths.UI_MAIN + Paths.FOLDERS, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  verifyAlertMessage = () => {
    cy.get('[data-testid="alert-text"]')
      .should('be.visible')
      .and('contain.text', Alerts.OUTAGE);
  };
}

export default new PatienErrorPage();
