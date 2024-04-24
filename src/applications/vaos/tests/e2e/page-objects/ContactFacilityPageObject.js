import PageObject from './PageObject';

export class ContactFacilityPageObject extends PageObject {
  assertText(value, exist = true) {
    if (exist) {
      cy.findByText(value);
    } else {
      cy.findByText(value).should('not.exist');
    }

    return this;
  }

  assertUrl() {
    cy.url().should('include', 'contact-facility');
    cy.get('va-loading-indicator.hydrated', { timeout: 240000 }).should(
      'not.exist',
    );

    cy.axeCheckBestPractice();

    return this;
  }

  assertWarningAlert(exist = true) {
    if (exist) {
      cy.findByText(/Call to schedule your second dose/i, { selector: 'h2' });
    } else {
      cy.findByText(/Call to schedule your second dose/i, {
        selector: 'h2',
      }).should('not.exist');
    }

    return this;
  }

  visit() {
    cy.url().should('include', '/contact-facility');
    cy.axeCheckBestPractice();

    return this;
  }

  clickNextButton() {
    cy.findByText(/Continue/i).should('not.exist');
    return this;
  }
}

export default new ContactFacilityPageObject();
