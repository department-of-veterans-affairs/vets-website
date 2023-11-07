import PageObject from './PageObject';

export class ClinicChoicePageObject extends PageObject {
  assertAddress({ facilityName, exist = true } = {}) {
    if (exist) cy.findByText(facilityName, { selector: 'h2' });
    else cy.findByText(facilityName).should('not.exist');

    return this;
  }

  assertSingleClinic() {
    cy.findByText(/Would you like to make an appointment at/i);
    return this;
  }

  assertUrl() {
    cy.url().should('include', '/clinic', { timeout: 5000 });
    cy.findByText(/Choose a VA clinic/i, { selector: 'h1' });
    cy.axeCheckBestPractice();

    return this;
  }

  selectClinic(selection) {
    cy.findByLabelText(selection).as('radio');
    cy.get('@radio').check();

    return this;
  }
}

export default new ClinicChoicePageObject();
