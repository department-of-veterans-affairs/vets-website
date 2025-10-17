type MockUser = any;

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to perform accessibility checking.
     * @example cy.axeCheckBestPractice()
    */
    axeCheckBestPractice(): Chainable<Subject>;

    /**
     * Custom command to login to va.gov application.
     * @example cy.login(mockUser)
    */
    login(value: MockUser): Chainable<Subject>;
  }
}