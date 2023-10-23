import PageObject from './PageObject';

class ClinicChoicePageObject extends PageObject {
  assertUrl() {
    // cy.url().should('include', url, { timeout: 5000 });
    cy.url().should('include', '/clinic', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectClinic(selection) {
    // cy.findByText(/Choose where you’d like to get your vaccine/);
    // cy.findByText(label);
    cy.findByText(/Choose a VA clinic/i, { selector: 'h1' });
    cy.findByLabelText(selection).as('radio');
    // .focus();
    cy.get('@radio').check();

    // cy.url().should('include', '/clinics');
    // cy.axeCheckBestPractice();
    // cy.findByText(
    //   /Choose a clinic below or request a different clinic for this appointment/i,
    // );
    // cy.get('#root_clinicId_0')
    //   .focus()
    //   .click();

    return this;
  }
}

export default new ClinicChoicePageObject();
