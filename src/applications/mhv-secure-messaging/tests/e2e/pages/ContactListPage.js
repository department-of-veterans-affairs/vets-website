import { Paths } from '../utils/constants';

class ContactListPage {
  loadContactList = () => {
    cy.visit(`${Paths.UI_MAIN}/contact-list`);
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
    cy.get(`[data-testid="contact-list-select-all-teams"]`).then(el => {
      // eslint-disable-next-line no-unused-expressions
      expect(el.prop('checked')).to.eq(value);
    });

    cy.get(`[data-testid="contact-list-select-team"]`).each(el => {
      cy.wrap(el).then(box => {
        // eslint-disable-next-line no-unused-expressions
        expect(box.prop(`checked`)).to.eq(value);
      });
    });
  };

  clickSelectAllCheckBox = () => {
    cy.get(`[data-testid="contact-list-select-all-teams"]`)
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
