class PatientMessageDetailsPage {
  loadReplyPage = () => {
    cy.get('[data-testid="reply-button-top"]').click();
  };
}
export default PatientMessageDetailsPage;
