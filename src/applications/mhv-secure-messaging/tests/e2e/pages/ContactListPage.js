import { Locators, Paths, Alerts } from '../utils/constants';

class ContactListPage {
  loadContactList = () => {
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

  clickSelectAllCheckBox = () => {
    cy.get(Locators.CHECKBOX.CL_ALL)
      .find(`#checkbox-element`)
      .click({
        waitForAnimations: true,
        force: true,
      });
  };

  verifyButtons = () => {
    cy.get(`[text="Save and exit"]`)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`include.text`, `Save and exit`);

    cy.get(`[text="Cancel"]`)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`include.text`, `Cancel`);
  };

  clickSaveModalCancelButton = () => {
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

  clickSaveAndExitButton = () => {
    cy.get(Locators.BUTTONS.SAVE_CONTACT_LIST).click();
  };

  verifyContactListSavedAlert = () => {
    cy.get(Locators.ALERTS.CONFIRM).should(
      `include.text`,
      Alerts.CONTACT_LIST.SAVED,
    );
  };

  clickBackToInbox = () => {
    cy.get(Locators.BACK_TO).click();
  };
}

export default new ContactListPage();
