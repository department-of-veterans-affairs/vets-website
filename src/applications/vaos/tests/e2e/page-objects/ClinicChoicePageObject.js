import PageObject from './PageObject';

class ClinicChoicePageObject extends PageObject {
  assertSingleClinic() {
    cy.get('va-radio').contains('Would you like to make an appointment at');
    return this;
  }

  assertUrl() {
    cy.url().should('include', '/clinic', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  /**
   * Method to select a clinic.
   *
   * @param {Object} params
   * @param {string|RegExp} [params.selection] Radio button to select
   * @param {boolean} [params.isCovid=false]
   *
   * @returns
   * @memberof ClinicChoicePageObject
   */
  selectClinic({ selection, isCovid = false } = {}) {
    if (isCovid) {
      cy.findByText(/Choose a clinic/i, { selector: 'h1' });
      cy.findByLabelText(selection).as('radio');
      cy.get('@radio').check();

      return this;
    }
    return super.selectRadioButtonShadow(selection);
  }
}

export default new ClinicChoicePageObject();
