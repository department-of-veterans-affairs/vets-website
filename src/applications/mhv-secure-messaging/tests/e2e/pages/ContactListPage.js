import { Locators, Paths, Alerts, Data } from '../utils/constants';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import SharedComponents from './SharedComponents';

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
    cy.findByText('Messages: Contact list', { selector: 'h1' }).should(
      'be.visible',
    );

    cy.findByText(`Need help?`, { selector: 'h2' }).should('be.visible');
  };

  checkBoxByName = name => {
    return cy
      .get(`[label="${name}"]`)
      .shadow()
      .find(`input`);
  };

  accordionByHeader = name => {
    return cy.get(`[header="${name}"]`);
  };

  accordionBySubheader = name => {
    return cy.get(`[subheader="${name}"]`);
  };

  verifyAccordionSubheader = name => {
    this.accordionBySubheader(name).should('be.visible');
  };

  verifySingleCheckBox = (team, value) => {
    cy.get(`[label="${team}"]`).should('have.prop', `checked`, value);
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
    this.checkBoxByName(name).click({ force: true });
  };

  selectFirstCheckBox = name => {
    this.checkBoxByName(name)
      .first()
      .click({ force: true });
  };

  validateCheckBoxDoesNotExist = name => {
    cy.get(`[label="${name}"]`).should('not.exist');
  };

  verifyButtons = () => {
    cy.get(Locators.BUTTONS.CL_SAVE)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`include.text`, Data.BUTTONS.SAVE_AND_EXIT);

    cy.findByTestId(Locators.BUTTONS.CL_GO_BACK)
      .should(`be.visible`)
      .and(`have.prop`, `text`, Data.BUTTONS.GO_BACK);
  };

  clickGoBackButton = () => {
    cy.findByTestId(Locators.BUTTONS.CL_GO_BACK).click({ force: true });
  };

  verifySaveAlert = () => {
    cy.contains(Alerts.CONTACT_LIST.SAVE).should(`be.visible`);

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

  closeSaveModal = (
    title = 'Do you want to save your changes to your contact list?',
  ) => {
    cy.get(`va-modal[modal-title="${title}"]`)
      .find(`button.va-modal-close`)
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

    cy.wait('@savedList');
    cy.wait('@updatedRecipients');
  };

  verifyContactListSavedAlert = () => {
    cy.get(Locators.ALERTS.GEN_ALERT).should(
      `include.text`,
      Alerts.CONTACT_LIST.SAVED,
    );
    // Success alerts use role="status" for AT announcement without stealing
    // focus from the user's current position (per MHV accessibility decisions).
  };

  clickBackToInbox = () => {
    SharedComponents.clickBackBreadcrumb();
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
      .and(`contain`, Alerts.CONTACT_LIST.LOAD_API_ERROR);
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
