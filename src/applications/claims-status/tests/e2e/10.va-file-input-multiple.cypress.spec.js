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

      // Verify the component is visible and displays the label and hint text
      cy.get('va-file-input-multiple')
        .should('be.visible')
        .shadow()
        .should('contain.text', 'Upload additional evidence')
        .and(
          'contain.text',
          'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file',
        );

      cy.axeCheck();
    });
  });

  describe('User Story #2: File input instructions', () => {
    it('should display file input instructions to the user', () => {
      setupComponentTest();

      // Navigate to the file input's shadow DOM and verify instructions are visible
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .should('contain.text', 'Drag a file here')
        .and('contain.text', 'choose from folder');

      cy.axeCheck();
    });
  });

  describe('User Story #3: Adding files', () => {
    it('should allow users to add files', () => {
      setupComponentTest();

      const fileName = 'test-document.pdf';

      // Select a file (simulates the result of user interaction with file picker)
      // Note: "choose from folder" text is not clickable (pointer-events: none)
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from('test content'),
          fileName,
        });

      // Verify the file name is visible to the user
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .should('contain.text', fileName);

      cy.axeCheck();
    });
  });
});
