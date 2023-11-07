import PageObject from './PageObject';

export class VAFacilityPageObject extends PageObject {
  assertSingleLocation({ exist = true } = {}) {
    cy.findByText(/Your appointment location/i, { selector: 'h1' });
    if (exist) cy.findByText(/We found one VA facility for your/i);
    else
      cy.findByText(/We found one VA facility for your/i).should('not.exist');

    return this;
  }

  assertUrl() {
    cy.url().should('include', '/location', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectLocation(label) {
    cy.findByText(/Choose a VA location/i, { selector: 'h1' });
    // cy.wait(['@v2:get:eligibility', '@v2:get:clinics']).then(() => {
    //   cy.get('#root_clinicId_0')
    //     .as('radio')
    //     .focus();
    //   cy.get('@radio').click();
    // });
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new VAFacilityPageObject();
