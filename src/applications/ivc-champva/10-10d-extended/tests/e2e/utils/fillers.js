export const fillSharedAddressAndContinue = () => {
  cy.get('va-radio-option')
    .eq(1)
    .click();
  cy.clickFormContinue();
};

export const fillStatementOfTruthAndSubmit = () => {
  cy.get('@testData').then(data => {
    cy.fillVaStatementOfTruth({
      fullName: data.statementOfTruthSignature,
      checked: true,
    });
    cy.get('va-button[text*="submit" i]').click();
  });
};
