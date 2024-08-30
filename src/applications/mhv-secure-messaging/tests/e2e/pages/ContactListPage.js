import { Locators, Paths, Alerts, Data } from '../utils/constants';

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

  selectAllCheckBox = () => {
    cy.get(Locators.CHECKBOX.CL_ALL)
      .find(`#checkbox-element`)
      .click({
        waitForAnimations: true,
        force: true,
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

  // mock response will be amended in further updates
  clickSaveAndExitButton = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/preferences/recipients',
      '200',
    ).as('savedList');

    cy.get(Locators.BUTTONS.SAVE_CONTACT_LIST).click({ force: true });
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

  verifyEmptyContactListAlert = () => {
    cy.get(`#checkbox-error-message`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.CONTACT_LIST.EMPTY);
  };
}

export default new ContactListPage();
