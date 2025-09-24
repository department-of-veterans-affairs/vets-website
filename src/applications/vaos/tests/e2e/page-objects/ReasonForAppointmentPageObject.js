import PageObject from './PageObject';

class ReasonForAppointmentPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/reason');
    cy.axeCheckBestPractice();

    return this;
  }

  selectReasonForAppointment() {
    return super.selectRadioButton(/Routine or follow-up visit/i);
  }

  assertLabel({ label }) {
    return this.assertShadow({
      element: 'va-textarea',
      text: label,
    });
  }

  typeAdditionalText({ content }) {
    cy.get('va-textarea')
      .shadow()
      .find('textarea')
      .type(content);

    return this;
  }
}

export default new ReasonForAppointmentPageObject();
