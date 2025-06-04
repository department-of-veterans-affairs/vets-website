import { Paths, Alerts, Locators } from '../utils/constants';
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
    cy.get(`h2`)
      .should(`be.visible`)
      .and(`include.text`, `Or try these other health resources`);

    cy.findByTestId(`mhv-page-not-found`)
      .find(`p`)
      .eq(0)
      .should(`be.visible`)
      .and(
        `include.text`,
        `If you typed or copied the web address, check that it’s correct.`,
      );

    cy.findByTestId(`mhv-page-not-found`)
      .find(`p`)
      .eq(1)
      .should(`be.visible`)
      .and(
        `include.text`,
        `If you still can’t find what you’re looking for, try visiting the My HealtheVet homepage.`,
      );

    cy.findByTestId(`mhv-page-not-found`)
      .find(`va-link`)
      .eq(0)
      .should(`be.visible`)
      .and(`have.attr`, `href`, `/my-health`)
      .and(`have.attr`, `text`, `Go to our My HealtheVet on VA.gov homepage`);

    cy.findByTestId(`mhv-page-not-found`)
      .find(`va-link`)
      .eq(1)
      .should(`be.visible`)
      .and(
        `have.attr`,
        `href`,
        `https://eauth.va.gov/MAP/users/v2/landing?redirect_uri=/cirrusmd/`,
      )
      .and(
        `have.attr`,
        `text`,
        `Chat live with a health professional on VA health chat`,
      );

    cy.findByTestId(`mhv-page-not-found`)
      .find(`va-link`)
      .eq(2)
      .should(`be.visible`)
      .and(`have.attr`, `href`, `/find-locations`)
      .and(`have.attr`, `text`, `Find a VA facility`);
  };
}

export default new PatientErrorPage();
