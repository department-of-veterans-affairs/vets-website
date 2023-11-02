import PageObject from './PageObject';

export class ClinicChoicePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/clinic', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectClinic(selection) {
    cy.findByText(/Choose a VA clinic/i, { selector: 'h1' });
    cy.findByLabelText(selection).as('radio');
    cy.get('@radio').check();

    return this;
  }
}

export default new ClinicChoicePageObject();
