// TDD E2E Tests for VA File Input Multiple Component
describe('VA File Input Multiple - TDD E2E Tests', () => {
  // Helper function to set up test environment with our component
  const setupComponentTest = () => {
    // Login and navigate to claims page where component is temporarily added
    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  describe('User Story #1: Label and hint text', () => {
    it('should display correct label and hint text', () => {
      setupComponentTest();

      // Verify the component is visible to the user
      cy.get('va-file-input-multiple').should('be.visible');

      // Verify the user can actually see the label text in the shadow DOM
      cy.get('va-file-input-multiple')
        .shadow()
        .should('contain.text', 'Upload additional evidence');

      // Verify the user can actually see the hint text in the shadow DOM
      cy.get('va-file-input-multiple')
        .shadow()
        .should(
          'contain.text',
          'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file',
        );

      cy.axeCheck();
    });
  });
});
