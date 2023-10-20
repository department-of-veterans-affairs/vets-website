import PageObject from './PageObject';

class CommunityCarePreferencesPage extends PageObject {
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
    cy.findByLabelText(/doe, jane/i).click();
    cy.findByText(/Choose provider/i).click();
    cy.axeCheckBestPractice();
    cy.contains('Selected provider');

    return this;
  }

  validateHomeAddress(trueOrFalse) {
    cy.findByTestId('providersSelect')
      .as('providersSelect')
      .shadow();
    cy.get('@providersSelect')
      .find('select')
      .as('select');

    cy.get('@select')
      .find('option')
      .contains('Your home address')
      .should(`${trueOrFalse ? 'exist' : 'not.exist'}`);

    return this;
  }
}

export default new CommunityCarePreferencesPage();
