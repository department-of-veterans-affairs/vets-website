export const fillStatementOfTruthSignature = veteranSignature => {
  cy.get('#veteran-signature')
    .shadow()
    .get('#inputField')
    .type(veteranSignature);
};

export const checkStatementOfTruthBox = () => {
  cy.get(`va-checkbox[id="veteran-certify"]`)
    .shadow()
    .find('input')
    .click({ force: true });
};

export const reviewAndSubmitPageFlow = (
  signerName,
  submitButtonText = 'Submit application',
) => {
  let veteranSignature = signerName;

  if (typeof veteranSignature === 'object') {
    veteranSignature = signerName.middle
      ? `${signerName.first} ${signerName.middle} ${signerName.last}`
      : `${signerName.first} ${signerName.last}`;
  }

  fillStatementOfTruthSignature(veteranSignature);
  checkStatementOfTruthBox();
  cy.findByText(submitButtonText, {
    selector: 'button',
  }).click();
};
