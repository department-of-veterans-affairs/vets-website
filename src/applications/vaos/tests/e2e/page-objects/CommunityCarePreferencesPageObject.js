import PageObject from './PageObject';

export class CommunityCarePreferencesPageObject extends PageObject {
  assertHomeAddress({ exist = true } = {}) {
    cy.findByTestId('providersSelect')
      .as('providersSelect')
      .shadow();
    cy.get('@providersSelect')
      .find('select')
      .as('select');

    cy.get('@select')
      .find('option')
      .contains('Your home address')
      .should(`${exist ? 'exist' : 'not.exist'}`);

    return this;
  }

  assertInfoAlert() {
    cy.findByText(/We can.t find any Primary care providers close to you/i, {
      selector: 'h2',
    });
    return this;
  }

  assertUrl() {
    cy.url().should('include', 'preferred-provider');
    cy.axeCheckBestPractice();

    return this;
  }

  expandAccordian() {
    cy.findByText(/Choose a provider/).click();
    cy.axeCheckBestPractice();

    return this;
  }

  removeProvider(_label) {
    cy.contains('Selected provider');
    cy.findByText(/remove/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Yes, remove provider/i).click();

    return this;
  }

  selectProvider(_label) {
    cy.findByText(/Choose a provider/i, { selector: 'h2' }).click({
      waitForAnimations: true,
    });
    cy.wait('@v1:get:provider');
    cy.findByLabelText(/doe, jane/i).check({ waitForAnimations: true });
    cy.findByText(/Choose provider/i, { selector: 'button' }).click({
      waitForAnimations: true,
    });
    cy.findByText(/Selected provider/i);
    cy.axeCheckBestPractice();

    return this;
  }

  selectOption(value) {
    cy.findByTestId('providersSelect')
      .as('providersSelect')
      .shadow();
    cy.get('@providersSelect')
      .find('select')
      .as('select');

    cy.get('@select')
      .find('option')
      .contains(value)
      // Invoke jQuery attr function to get the value of the option we want to
      // select.
      .invoke('attr', 'value')
      .then(v => {
        // Select the option. NOTE: Using force since the default select option
        // is disabled due custom CSS select styling.
        cy.get('@select').select(v, { force: true });
      });

    return this;
  }

  selectCurrentLocation() {
    return this.selectOption('Your current location');
  }

  selectHomeAddress() {
    return this.selectOption('Your home address');
  }
}

export default new CommunityCarePreferencesPageObject();
