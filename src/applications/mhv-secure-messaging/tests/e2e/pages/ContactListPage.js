import { Locators, Paths, Alerts, Data } from '../utils/constants';
import mockRecipients from '../fixtures/recipients-response.json';

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
    cy.get(`[text="Save and exit"]`)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`include.text`, Data.BUTTONS.SAVE_AND_EXIT);

    cy.get(`[text="Cancel"]`)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`include.text`, `Cancel`);
  };

  clickCancelButton = () => {
    cy.get(Locators.ALERTS.CANCEL).click({ force: true });
  };

  verifySaveAlertHeader = () => {
    cy.get(Locators.ALERTS.HEADER).should(
      `include.text`,
      Alerts.CONTACT_LIST.SAVE,
    );
  };

  closeSaveModal = () => {
    cy.get(`.first-focusable-child`).click();
  };

  // mock response could be amended in further updates
  clickSaveAndExitButton = () => {
    cy.intercept('POST', Paths.INTERCEPT.SELECTED_RECIPIENTS, '200').as(
      'savedList',
    );

    cy.get(Locators.BUTTONS.SAVE_CONTACT_LIST).click({ force: true });
  };

  verifyContactListSavedAlert = () => {
    cy.get(Locators.ALERTS.CONFIRM).should(
      `include.text`,
      Alerts.CONTACT_LIST.SAVED,
    );
    cy.get('.va-alert').should(`be.focused`);
  };

  clickBackToInbox = () => {
    cy.get(Locators.BACK_TO).click();
  };

  verifyEmptyContactListAlert = () => {
    cy.get(`#checkbox-error-message`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.CONTACT_LIST.EMPTY);

    cy.get(Locators.CHECKBOX.CL_ALL)
      .first()
      .should('have.focus');

    this.verifyAllCheckboxes(false);
  };

  verifyContactListLink = () => {
    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`a[href*="contact"]`)
      .should(`be.visible`)
      .and('have.text', Data.CL_LINK_TEXT);

    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`a[href*="contact"]`)
      .click({ force: true });

    cy.contains(`Delete draft`).click({ force: true });
    cy.url().should(`include`, `${Paths.UI_MAIN}/contact-list`);
  };
}

export default new ContactListPage();
