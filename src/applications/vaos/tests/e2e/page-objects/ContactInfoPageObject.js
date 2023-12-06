import PageObject from './PageObject';

export class ContactInfoPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/contact-information');
    cy.axeCheckBestPractice();

    return this;
  }

  typeEmailAddress(val) {
    cy.get('#root_email').type(val);
    return this;
  }

  typePhoneNumber(val) {
    cy.get('#root_phoneNumber').type(val);
    return this;
  }

  selectPreferredTime() {
    cy.findByLabelText(/Morning/).click();
    return this;
  }
}

export default new ContactInfoPageObject();
