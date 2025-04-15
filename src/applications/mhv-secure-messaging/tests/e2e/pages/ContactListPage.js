import { Locators, Paths, Alerts, Data } from '../utils/constants';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';

class ContactListPage {
  loadContactList = (recipients = mockRecipients) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`,
      recipients,
    ).as('allRecipients');
    cy.visit(`${Paths.UI_MAIN + Paths.CONTACT_LIST}`);
  };

  verifyHeaders = () => {
    cy.get(`h1`)
      .should(`be.visible`)
      .and(`have.text`, `Contact list`);

    cy.get(`.contactListForm`)
      .find(`h2`)
      .should(`have.text`, `Need help?`);
  };

  verifySingleCheckBox = (team, value) => {
    cy.get(`[label*=${team}]`).should('have.prop', `checked`, value);
  };

  verifyAllCheckboxes = value => {
    cy.get(Locators.CHECKBOX.CL_ALL).then(el => {
      expect(el.prop('checked')).to.eq(value);
    });

    cy.get(Locators.CHECKBOX.CL_SINGLE).each(el => {
      cy.wrap(el).then(box => {
        expect(box.prop(`checked`)).to.eq(value);
      });
    });
  };

  selectAllCheckBox = () => {
    cy.get(Locators.CHECKBOX.CL_ALL)
      .find(`#checkbox-element`)
      .click({
        waitForAnimations: true,
        force: true,
        multiple: true,
      });
  };

  selectCheckBox = name => {
    cy.get(`[label*=${name}]`)
      .shadow()
      .find(`input`)
      .click({ force: true });
  };

  verifyButtons = () => {
    cy.get(Locators.BUTTONS.CL_SAVE)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`include.text`, Data.BUTTONS.SAVE_AND_EXIT);

    cy.get(Locators.BUTTONS.CL_GO_BACK)
      .should(`be.visible`)
      .and(`include.text`, Data.BUTTONS.GO_BACK);
  };

  clickGoBackButton = () => {
    cy.get(Locators.BUTTONS.CL_GO_BACK).click({ force: true });
  };

  verifySaveAlert = () => {
    cy.get(Locators.ALERTS.HEADER).should(
      `include.text`,
      Alerts.CONTACT_LIST.SAVE,
    );

    cy.get(Locators.ALERTS.CL_SAVE)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`have.text`, `Save`);

    cy.get(Locators.ALERTS.CL_DELETE_AND_EXIT)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`have.text`, `Delete changes and exit`);
  };

  clickModalSaveButton = () => {
    cy.get(`[data-testid="sm-route-navigation-guard-confirm-button"]`).click();
  };

  closeSaveModal = () => {
    cy.get(`.first-focusable-child`)
      .should(`be.focused`)
      .click();
  };

  // mock response could be amended in further updates
  clickSaveContactListButton = () => {
    cy.get(Locators.BUTTONS.CL_SAVE)
      .shadow()
      .find(`button`)
      .click({ force: true });
  };

  saveContactList = updatedRecipients => {
    cy.intercept('POST', Paths.INTERCEPT.SELECTED_RECIPIENTS, {
      status: '200',
    }).as('savedList');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`,
      updatedRecipients,
    ).as('updatedRecipients');

    cy.get(Locators.BUTTONS.CL_SAVE)
      .shadow()
      .find(`button`)
      .click({ force: true });
  };

  verifyContactListSavedAlert = () => {
    cy.get(Locators.ALERTS.GEN_ALERT).should(
      `include.text`,
      Alerts.CONTACT_LIST.SAVED,
    );
    cy.get('.va-alert').should(`be.focused`);
  };

  clickBackToInbox = () => {
    cy.get(Locators.BACK_TO).click();
  };

  verifyEmptyContactListAlert = () => {
    cy.get(`.usa-error-message`).each(el => {
      cy.wrap(el)
        .should(`be.visible`)
        .and(`have.text`, Alerts.CONTACT_LIST.EMPTY);
    });

    cy.get(Locators.CHECKBOX.CL_ALL)
      .first()
      .should('have.focus');

    this.verifyAllCheckboxes(false);
  };

  verifyContactListLink = () => {
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .find(`a[href*="contact"]`)
      .should(`be.visible`)
      .and('have.text', Data.CL_LINK_TEXT);

    cy.get(Locators.DROPDOWN.ADD_INFO)
      .find(`a[href*="contact"]`)
      .click({ force: true });

    cy.url().should(`include`, `${Paths.UI_MAIN}/contact-list`);
  };

  setPreferredTeams = (initialRecipientsList, teamNamesList) => {
    return {
      ...initialRecipientsList,
      data: initialRecipientsList.data.map(team => ({
        ...team,
        attributes: {
          ...team.attributes,
          preferredTeam: teamNamesList.some(partial =>
            team.attributes.name.includes(partial),
          ),
        },
      })),
    };
  };

  verifyLoadAPIAlerts = () => {
    cy.get(`va-alert`)
      .find(`h2`)
      .should(`be.visible`)
      .and(`have.text`, Alerts.CONTACT_LIST.LOAD_API_ERROR);
  };

  verifySaveAPIAlert = () => {
    cy.get(Locators.ALERTS.ALERT_TEXT)
      .should(`be.visible`)
      .and('contain.text', Alerts.CONTACT_LIST.SAVE_API_ERROR)
      .parents(`va-alert`)
      .shadow()
      .find(`button`)
      .should(`have.focus`);
  };
}

export default new ContactListPage();
