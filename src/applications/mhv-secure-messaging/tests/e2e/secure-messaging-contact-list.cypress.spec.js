import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Secure Messaging Contact list', () => {
  it('verify base web-elements', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    // navigate to `contact list` page
    cy.visit(`${Paths.UI_MAIN}/contact-list`);

    // verify headers
    cy.get(`h1`)
      .should(`be.visible`)
      .and(`have.text`, `Contact list`);

    cy.get(`.contactListForm`)
      .find(`h2`)
      .should(`have.text`, `Need help?`);

    // verify checkboxes
    cy.get(`[data-testid="contact-list-select-all-teams"]`).then(el => {
      expect(el.prop('checked')).to.be.true;
    });

    cy.get(`[data-testid="contact-list-select-team"]`).each(el => {
      cy.wrap(el).then(box => {
        expect(box.prop(`checked`)).to.be.true;
      });
    });

    // verify uncheck all
    cy.get(`[data-testid="contact-list-select-all-teams"]`)
      .find(`#checkbox-element`)
      .click({
        waitForAnimations: true,
        force: true,
      });

    cy.get(`[data-testid="contact-list-select-all-teams"]`).then(el => {
      expect(el.prop('checked')).to.be.false;
    });

    cy.get(`[data-testid="contact-list-select-team"]`).each(el => {
      cy.wrap(el).then(box => {
        expect(box.prop(`checked`)).to.be.false;
      });
    });

    // verify buttons
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
