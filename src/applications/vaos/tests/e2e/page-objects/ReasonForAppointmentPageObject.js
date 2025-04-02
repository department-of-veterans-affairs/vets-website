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
    return super.selectRadioButtonShadow(/Routine or follow-up visit/i);
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
