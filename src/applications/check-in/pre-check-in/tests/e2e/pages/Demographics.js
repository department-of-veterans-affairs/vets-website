import Timeouts from 'platform/testing/e2e/timeouts';

class Demographics {
  initializeApi() {
    // @TODO: fill in once we are actually using the API
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Is this your current contact information?');
  }
  validateDemographicsFields() {
    cy.get("dl[data-testid='demographics-fields']")
      .find('dt:nth-of-type(1)')
      .should('have.text', 'Mailing address')
      .next()
      .next()
      .should('have.text', 'Home address')
      .next()
      .next()
      .should('have.text', 'Home phone')
      .next()
      .next()
      .should('have.text', 'Mobile phone')
      .next()
      .next()
      .should('have.text', 'Work phone')
      .next()
      .next()
      .should('have.text', 'Email address');
  }
  // @TODO: update to match against mock api.
  validateDemographicData() {
    cy.get("dl[data-testid='demographics-fields']")
      .find('dd:nth-of-type(1)')
      .should('have.text', '123 Turtle TrailTreetopper, Tennessee 10101')
      .next()
      .next()
      .should(
        'have.text',
        '445 Fine Finch Fairway, Apt 201Fairfence, Florida 44554',
      )
      .next()
      .next()
      .should('have.text', '555-222-3333')
      .next()
      .next()
      .should('have.text', '555-333-4444')
      .next()
      .next()
      .should('have.text', '555-444-5555')
      .next()
      .next()
      .should('have.text', 'kermit.frog@sesameenterprises.us');
  }
  attemptToGoToNextPage() {
    cy.get('button[data-testid="yes-button"]').click();
  }
}

export default new Demographics();
