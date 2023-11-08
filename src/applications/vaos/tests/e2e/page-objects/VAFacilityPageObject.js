import PageObject from './PageObject';

export class VAFacilityPageObject extends PageObject {
  /**
   * Method to assert exisitence of home address.
   *
   * @param {Object} arguments
   * @param {String|RegExp=} arguments.address - Address to assert.
   * @param {boolean} [arguments.exist=true] - Assert if address exist or not.
   * @memberof VAFacilityPageObject
   */
  assertHomeAddress({ address, exist = true } = {}) {
    if (exist) {
      cy.findByText(/Facilities based on your home address/i);
      cy.findByText(address);
    } else {
      cy.findByText(/Facilities based on your home address/i).should(
        'not.exist',
      );
    }

    return this;
  }

  assertOneLocation({ locationName } = {}) {
    cy.findByText(
      /We found one VA location where you.re registered that offers COVID-19 vaccine appointments/i,
    );
    cy.findByText(locationName);

    return this;
  }

  assertUrl() {
    cy.log('assertUrl');
    // cy.url().should('include', url, { timeout: 5000 });
    cy.url().should('include', '/location', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  assertWarningAlert({ text, exist = true }) {
    if (exist) {
      cy.get('va-alert[status=warning]')
        .as('alert')
        .shadow();
      cy.get('@alert').contains(text);
    } else {
      cy.get('va-alert[status=warning]').should('not.exist');
    }

    return this;
  }

  assertWarningModal({ text, exist = true }) {
    if (exist) {
      cy.get('va-modal[status=warning]')
        .as('alert')
        .shadow();
      cy.get('@alert').contains(text);
      cy.log('done');
    } else {
      cy.get('va-alert[status=warning]').should('not.exist');
    }

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
    cy.log('selectLocation');
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new VAFacilityPageObject();
