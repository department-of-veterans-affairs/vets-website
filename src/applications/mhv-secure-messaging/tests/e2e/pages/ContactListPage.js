import { Locators, Paths } from '../utils/constants';

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
      // eslint-disable-next-line no-unused-expressions
      expect(el.prop('checked')).to.eq(value);
    });

    cy.get(Locators.CHECKBOX.CL_SINGLE).each(el => {
      cy.wrap(el).then(box => {
        // eslint-disable-next-line no-unused-expressions
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
      .and(`have.text`, `Save and exit`);

    cy.get(`[text="Cancel"]`)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`have.text`, `Cancel`);
  };
}

export default new ContactListPage();
