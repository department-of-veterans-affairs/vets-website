export const fillStatementOfTruthAndSubmit = () => {
  cy.get('@testData').then(data => {
    cy.get('va-statement-of-truth').then($el => {
      cy.fillVaStatementOfTruth($el, {
        fullName: data.statementOfTruthSignature,
        checked: true,
      });
    });
    cy.get('va-button[text*="submit" i]').click();
  });
};
