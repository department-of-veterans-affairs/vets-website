import PageObject from './PageObject';

export class ClinicChoicePageObject extends PageObject {
  assertSingleClinic() {
    cy.findByText(/Would you like to make an appointment at/i);
    return this;
  }

  assertUrl() {
    // cy.url().should('include', url, { timeout: 5000 });
    cy.url().should('include', '/clinic', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectClinic({ selection, isCovid = false } = {}) {
    if (isCovid) {
      cy.findByText(/Choose a clinic/i, { selector: 'h1' });
    } else {
      cy.findByText(/Choose a VA clinic/i, { selector: 'h1' });
    }

    cy.findByLabelText(selection).as('radio');
    cy.get('@radio').check();

    return this;
  }
}

export default new ClinicChoicePageObject();
