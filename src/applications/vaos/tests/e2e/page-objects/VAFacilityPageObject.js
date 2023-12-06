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

  /**
   * Method to assert whether single location/facility text is displayed or not.
   *
   * @param {Object} arguments - Method arguments.
   * @param {string|RegExp} arguments.locationName - Facility location name to assert.
   * @param {boolean} [arguments.isVA = true] - Is this a VA appointment or not.
   * @memberof VAFacilityPageObject
   */
  assertSingleLocation({ locationName, isVA = true } = {}) {
    if (isVA) {
      cy.findByText(/We found one VA facility for your .* appointment/i);
    } else {
      cy.findByText(
        /We found one VA location where you.re registered that offers COVID-19 vaccine appointments/i,
      );
    }
    cy.findByText(locationName);

    return this;
  }

  assertUrl({ axCheck = true } = {}) {
    cy.url().should('include', '/location', { timeout: 5000 });
    if (axCheck) cy.axeCheckBestPractice();

    return this;
  }

  closeModal() {
    cy.get('va-modal[status=warning]')
      .as('modal')
      .shadow();
    cy.get('@modal')
      .find('button')
      .click();

    return this;
  }

  selectLocation(label) {
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new VAFacilityPageObject();
