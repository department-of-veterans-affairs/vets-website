import { Paths, Alerts, Locators } from '../utils/constants';

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

  verifyAlertMessageText = () => {
    cy.get('[data-testid="alert-text"]')
      .should('be.visible')
      .and('contain.text', Alerts.OUTAGE);
  };

  verifyFromToDateErrorMessageText = (index, text) => {
    cy.get(Locators.FROM_TO_DATES_CONTAINER)
      .find('#error-message')
      .eq(index)
      .scrollIntoView()
      .should('contain.text', text);
  };
}

export default new PatienErrorPage();
