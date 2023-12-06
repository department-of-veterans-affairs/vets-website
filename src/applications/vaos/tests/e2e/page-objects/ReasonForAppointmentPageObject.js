import PageObject from './PageObject';

export class ReasonForAppointmentPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/reason');
    cy.axeCheckBestPractice();

    return this;
  }

  selectReasonForAppointment() {
    cy.findByLabelText(/Routine or follow-up visit/i).click();

    return this;
  }

  typeAdditionalText({
    content,
    label = /Please provide any additional details/,
  }) {
    cy.findByLabelText(label).type(content);
    return this;
  }
}

export default new ReasonForAppointmentPageObject();
