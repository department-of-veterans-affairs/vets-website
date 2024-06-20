declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to perform accessibility checking.
     * @example cy.axeCheckBestPractice()
    */
    axeCheckBestPractice(): Chainable<Element>

    /**
     * Custom command to login to va.gov application.
     * @example cy.login(mockUser)
    */
    login(value: MockUser): Chainable<Element>
  }
}