import Timeouts from 'platform/testing/e2e/timeouts';

class NextOfKin {
  initializeApi() {
    // @TODO: fill in once we are actually using the API
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Is this your current next of kin?');
  }
  validateNextOfKinFields() {
    cy.get("dl[data-testid='next-of-kin-fields']")
      .find('dt:nth-of-type(1)')
      .should('have.text', 'Name')
      .next()
      .next()
      .should('have.text', 'Relationship')
      .next()
      .next()
      .should('have.text', 'Address')
      .next()
      .next()
      .should('have.text', 'Phone')
      .next()
      .next()
      .should('have.text', 'Work phone');
  }
  // @TODO: update to match against mock api.
  validateNextOfKinData() {
    cy.get("dl[data-testid='next-of-kin-fields']")
      .find('dd:nth-of-type(1)')
      .should('have.text', 'VETERAN,JONAH')
      .next()
      .next()
      .should('have.text', 'BROTHER')
      .next()
      .next()
      .should('have.text', '123 Main St, Ste 234Los Angeles, CA 90089')
      .next()
      .next()
      .should('have.text', '111-222-3333')
      .next()
      .next()
      .should('have.text', '444-555-6666');
  }
  attemptToGoToNextPage() {
    cy.get('button[data-testid="yes-button"]').click();
  }
  attemptToGoToNextPageNoButtonClicked() {
    cy.get('button[data-testid="no-button"]').click();
  }
}

export default new NextOfKin();
