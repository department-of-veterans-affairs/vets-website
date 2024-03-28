import PageObject from './PageObject';

export class ReasonForAppointmentPageObject extends PageObject {
  assertHeading({ name }) {
    return this.assertShadow({
      element: 'va-radio',
      text: name,
    });
  }

  assertUrl() {
    cy.url().should('include', '/reason');
    cy.axeCheckBestPractice();

    return this;
  }

  selectReasonForAppointment() {
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .findByText(/Routine or follow-up visit/i)
      .click();

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
