export const fillStatementOfTruthAndSubmit = () => {
  cy.get('@testData').then(data => {
    cy.fillVaStatementOfTruth({
      fullName: data.signature,
      checked: true,
    });
    cy.get('va-button[text*="submit" i]').click();
  });
};
