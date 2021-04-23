describe('COVID-19 SAVE LIVES Act sign up', () => {
  describe('when entering names with a parentheses', () => {
    before(() => {
      cy.visit('health-care/covid-19-vaccine/sign-up/personal-information');
      cy.injectAxe();
    });

    it('should throw a validation error', () => {
      cy.axeCheck();

      cy.findByLabelText(/First name/i)
        .clear()
        .type('Stephen()');

      cy.findByLabelText(/Middle name/i).focus();

      cy.get('#root_firstName-error-message').contains(
        'Please only use letters and no parentheses',
      );

      cy.findByLabelText(/Last name/i)
        .clear()
        .type('Beers()');

      cy.findByLabelText(/Middle name/i).focus();

      cy.get('#root_lastName-error-message').contains(
        'Error Please only use your current last name and no parentheses',
      );
    });
  });
});
