import { Paths, Alerts, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from './GeneralFunctionsPage';

class PatientErrorPage {
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

  verifyPageNotFoundContent = () => {
    GeneralFunctionsPage.verifyPageHeader(`Page not found`);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`p`)
      .eq(0)
      .should(`be.visible`)
      .and(`include.text`, Data.NOT_FOUND.P_O);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`p`)
      .eq(1)
      .should(`be.visible`)
      .and(`include.text`, Data.NOT_FOUND.P_1);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`va-link`)
      .eq(0)
      .should(`be.visible`)
      .and(`have.attr`, `href`, `/my-health`)
      .and(`have.attr`, `text`, Data.NOT_FOUND.LINK);
  };

  verifyAttachmentErrorMessage = errormessage => {
    cy.get(Locators.ALERTS.ERROR_MESSAGE)
      .should('include.text', errormessage)
      .should('be.visible');
  };
}

export default new PatientErrorPage();
