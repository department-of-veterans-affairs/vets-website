import PageObject from './PageObject';

export class VAFacilityPageObject extends PageObject {
  assertUrl() {
    // cy.url().should('include', url, { timeout: 5000 });
    cy.url().should('include', '/location', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectLocation(label) {
    // cy.wait(['@v2:get:eligibility', '@v2:get:clinics']).then(() => {
    //   cy.findByText(/Your appointment location/i, { selector: 'h1' });
    //   if (isSingleLocation) {
    //     cy.findByText(/We found one VA facility for your/i);
    //   } else {
    //     cy.get('#root_clinicId_0')
    //       .focus()
    //       .click();
    //   }
    // });
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new VAFacilityPageObject();
